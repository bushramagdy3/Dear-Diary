from typing import TypedDict, Annotated, Sequence, List
from langgraph.graph import StateGraph, START, END 
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage, SystemMessage
from langchain_core.tools import tool
from IPython.display import Image, display
from settings import setting
from pydantic import BaseModel
import json
from openai import OpenAI
import base64

class PersonIdentificationResult(BaseModel):
    people_mentioned_ids: list[int]
    people_missing_names: list[str]

class PersonRefrence(BaseModel):
    name :str
    image :str

class ImageRequest(BaseModel):
    illustration: str
    people_refrences: List[PersonRefrence]

def getOwner(people):
    for person in people:
        if person["relationship"] == "user":
            return person
    return None

client = OpenAI(api_key=setting.OPENAI_API_KEY)

model = ChatOpenAI(model="gpt-5.6-luna", api_key=setting.OPENAI_API_KEY)

class AgentState(TypedDict):
    snippet :str
    people :List[dict]
    people_mentioned_ids :List[int]
    people_missing_names :List[str]
    image_request :ImageRequest
    generated_image: str

def people_identification(state :AgentState) -> AgentState:
    structured_model = model.with_structured_output(PersonIdentificationResult)
    system_prompt = SystemMessage(content="""
        You are responsible for identifying which people are physically present in a diary scene.

        You will receive:

        - A diary snippet describing an event.
        - A list of people already stored by the user. Each stored person has a unique id and identifying information such as their name, aliases, relationship to the user, or other descriptive information.

        Your task is to determine which people are actually present in the scene described by the diary snippet.

        For every person who is present:

        If the person can be matched to one of the stored people, return that stored person's id.
        If the diary clearly refers to a specific person who is present in the scene but cannot be matched to any stored person, include the name of that person in missing_people.

        One of the provided people may represent the diary owner and will be explicitly marked as the user.

        First-person references such as "I", "me", "my", and "myself" refer to this diary owner.

        If the diary owner is physically present or participating in the event, include the diary owner's ID (the user) in people_mentioned_ids.

        If the diary owner is present but no user profile is provided, include "user" in people_missing_names.

        A person should only count as present if they are actually participating in or physically present during the event being illustrated.

        Do not count people who are only mentioned, remembered, discussed, called, texted, or referred to as part of another story unless they are also physically present in the current scene.

        Do not invent identities. Do not assume two people are the same unless the provided information gives enough evidence to make that match.

        Return exactly these two fields:

        present_person_ids: a list of the integer IDs of stored people who are present in the scene.

        people_missing_names: a list of names for people who are present in the scene but do not have a matching stored-person record.

        If no stored people are present, return an empty list for present_person_ids.

        If no people are missing, return an empty list for missing_people.

        Do not describe the scene, explain your reasoning, generate an image prompt, or return any additional information.
        """)
    input = HumanMessage(content=f"""
        DIARY_SNIPPET:
        {json.dumps(state["snippet"])}

        KNOWN PEOPLE:
        {json.dumps(state["people"])}
    """)
    response = structured_model.invoke([system_prompt, input])
    return {
        "people_mentioned_ids": response.people_mentioned_ids,
        "people_missing_names": response.people_missing_names
    }

def should_interrupt(state :AgentState) -> str:
    if len(state["people_missing_names"]) == 0:
        return "don't interrupt"
    return "interrupt"

def interrupt(state :AgentState) -> AgentState:
    return None

def plan_illustration(state :AgentState) -> AgentState:
    owner = getOwner(state["people"])
    system_prompt = SystemMessage(content = """
    You are responsible for converting a diary snippet into a concise visual scene description for an image generator.

    Your task is to identify the single scene that best represents the event described in the diary snippet and express only the information needed to illustrate that scene.

    Use only information that is explicitly supported by the diary snippet.

    Preserve:

    * the names of people who are physically present in the scene
    * the setting, when it is stated or clearly established
    * the main visible actions or interactions
    * visually relevant objects or details that are explicitly part of the event

    Remove:

    * dialogue content
    * explanations and background information
    * thoughts and internal feelings that are not directly visible
    * people who are only mentioned or discussed but are not present
    * details that do not affect what should visibly appear in the illustration

    Do not invent, infer, embellish, or complete missing visual details. Do not add poses, gestures, expressions, objects, clothing, actions, relationships, or environmental details unless they are supported by the diary snippet.

    Prioritize the main visual moment of the scene. Omit secondary details that occur before or after that moment unless they are important to understanding what should be illustrated.

    Replace first-person references to the diary owner with the diary owner's provided name.

    Do not act as an art director. Do not specify camera angles, framing, lighting, composition, styling, or other image-generation choices.

    Keep the result natural, concise, and faithful to the original event. Prefer omission over assumption when a detail is uncertain.

    Return only the final scene description, with no explanation or additional text.

    """)
    input = HumanMessage(content=f"""
        DIARY SNIPPET:
        {state["snippet"]}

        DIARY OWNER:
        {owner["name"] if owner != None else "Undefined"}
    """)
    illustration = model.invoke([system_prompt, input]).content

    people_refrences = []
    for id in state["people_mentioned_ids"]:
        for person in state["people"]:
            if id == person["id"]:
                people_refrences.append(PersonRefrence(name=person["name"], image=person["image"]))

    request = ImageRequest(illustration=illustration, people_refrences=people_refrences)

    return {"image_request": request}

def generate_image(state :AgentState) -> AgentState:
    reference_lines = []
    image_files = []

    for i, person in enumerate(state["image_request"].people_refrences, start=1):
        reference_lines.append(f"Reference image {i} represents {person.name}.")
        image_files.append(open(person.image, "rb"))

    reference_mapping = "\n".join(reference_lines)

    prompt = f"""
        Create a standalone hand-drawn diary-style sketch illustration of the following scene:

        {state["image_request"].illustration}

        Reference images are provided for the named people in the scene.

        {reference_mapping}

        Use each reference image only to preserve the corresponding person's recognizable identity, facial features, and overall likeness. Do not copy the exact pose, outfit, hairstyle, background, framing, or other incidental details from the reference portraits unless they are directly required by the scene.

        Illustrate only the people who are explicitly part of the scene description. Do not add extra people, and do not include people who are only mentioned but not present.

        Use only scene details that are clearly supported by the provided scene description. Do not invent or embellish additional objects, actions, gestures, props, environmental details, or interactions that are not necessary to depict the described scene.

        Keep the composition natural, clean, and visually coherent.

        Render the result as a simple sketch with a diary-like aesthetic, but output only the illustration itself.

        Use a truly transparent background with no filled background layer.
        Do not simulate transparency with a checkerboard, grid, pattern, paper texture, or colored backdrop.

        Use each reference image only as an identity reference for the corresponding person.

        Preserve each person’s recognizable identity, facial structure, distinguishing features, and overall likeness, but adapt them naturally to the action, pose, and scene being illustrated.

        Do not force a portrait-like presentation of the face. Do not force front-facing angles, direct eye contact, or unnaturally clear facial visibility just to display identity.

        Allow the person’s pose, body position, movement, and viewing angle to follow the natural requirements of the scene, even when the face is turned, partially obscured, or not fully visible.

        Prioritize a natural and believable depiction of the action while keeping the person recognizable as the same individual.


        Do not include any notebook page, paper sheet, paper texture, spiral binding, frame, border, panel, page layout, mockup presentation, caption, label, watermark, or decorative surrounding elements.

        Do not include any text in the final image.
    """
    result = client.images.edit(
        model="gpt-image-2",
        image=image_files,
        prompt=prompt,
        background="transparent",
        output_format="png"
    )
    image_bytes = base64.b64decode(result.data[0].b64_json)
    with open("./generated/output.png", "wb") as f:
        f.write(image_bytes)
    return {"generated_image": "./generated/output.png"}

graph = StateGraph(AgentState)

graph.add_node("people_identification", people_identification)
graph.add_node("interrupt", interrupt)
graph.add_node("plan_illustration", plan_illustration)
graph.add_node("generate_image", generate_image)

graph.add_edge(START, "people_identification")
graph.add_conditional_edges(
    "people_identification",
    should_interrupt,
    {
        "don't interrupt": "plan_illustration",
        "interrupt": "interrupt"
    }
)
graph.add_edge("interrupt", "people_identification")
graph.add_edge("plan_illustration", "generate_image")
graph.add_edge("generate_image", END)

app = graph.compile()

# with open("graph.png", "wb") as f:
#     f.write(app.get_graph().draw_mermaid_png())

