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
    people_mentioned_ids: list[str]
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

        present_person_ids: a list of the IDs of stored people who are present in the scene.

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
                people_refrences.append(PersonRefrence(name=person["name"], image=person["imagePath"]))

    request = ImageRequest(illustration=illustration, people_refrences=people_refrences)

    return {"image_request": request}

def generate_image(state :AgentState) -> AgentState:
    reference_lines = []
    image_files = []
    try:
        for i, person in enumerate(state["image_request"].people_refrences, start=1):
            reference_lines.append(f"Reference image {i} represents {person.name}.")
            image_files.append(open(person.image, "rb"))

        image_files.append(open('./agents/inspo.jpeg', "rb"))
        reference_mapping = "\n".join(reference_lines)

        prompt = f"""
        Create a hand-drawn graphite pencil diary illustration of the following scene:

        {state["image_request"].illustration}

        IDENTITY REFERENCES:
        {reference_mapping}

        Every reference image listed in the identity mapping above represents that specific person's identity.

        The FINAL reference image is a STYLE REFERENCE ONLY.

        The completed illustration must look as though it was physically drawn by the same artist who drew the final style reference image.

        Do NOT copy the style reference's person, pose, subject, clothing, scene, or composition.
        Copy only its graphite drawing technique and visual language.

        DRAWING TECHNIQUE:
        Reproduce the actual graphite technique of the final style reference:

        - clearly visible individual pencil strokes
        - irregular hand-drawn contours
        - broken and overlapping sketch lines
        - varied pencil pressure
        - expressive graphite buildup
        - strong dark areas built with actual graphite marks
        - visible hatching and cross-hatching
        - directional pencil strokes following form
        - natural graphite smudging
        - imperfect handmade shading
        - rough transitions
        - construction marks where natural
        - unfinished sketch lines
        - raw sketchbook-quality texture

        Faces, hair, clothing, objects, and environmental elements must be created primarily through visible graphite linework and pencil marks.

        IMPORTANT:
        Do NOT create smooth grayscale-rendered people.
        Do NOT render skin with continuous digital gradients.
        Do NOT make faces look airbrushed.
        Do NOT create 3D-rendered facial volume.
        Do NOT create glossy AI-generated faces.
        Do NOT create polished beauty illustrations.
        Do NOT create clean vector-like outlines.
        Do NOT make the scene look like a digital painting.
        Do NOT make the result look like a normal image with a black-and-white or pencil filter applied.

        If an area needs darker value, construct that darkness through:
        - pencil pressure
        - visible graphite strokes
        - hatching
        - cross-hatching
        - overlapping marks
        - graphite buildup
        - smudging

        rather than smooth digital shading.

        The entire illustration must immediately read as:
        A REAL HAND-DRAWN GRAPHITE SKETCH.

        PEOPLE AND NATURAL POSES:
        Preserve the recognizable identity of every referenced person.

        The identity references determine WHO each person is.
        They do NOT determine their pose.

        Do NOT force referenced people to:
        - face the camera
        - look toward the viewer
        - maintain direct eye contact
        - keep their entire face visible
        - copy their portrait reference pose

        Their body orientation, head angle, gaze, pose, movement, and expression must naturally follow the diary scene.

        People may naturally appear:
        - from the side
        - in three-quarter view
        - looking downward
        - looking away
        - turned partially away
        - interacting with another person
        - moving naturally
        - partially obscured
        - with only part of the face visible

        as long as their recognizable identity remains consistent with their reference.

        SCENE AND ENVIRONMENT:
        This must be a complete SCENE ILLUSTRATION, not an isolated portrait or character cutout.

        The people must appear naturally inside an environment that visually supports the described moment.

        Use the diary scene to infer an appropriate surrounding environment when necessary.

        If the exact environment is not explicitly stated, infer a simple, plausible, generic setting that naturally fits the visible action and context.

        Do not invent unusual, story-changing, highly specific, or distracting environmental details.

        Include enough surrounding context, furniture, objects, surfaces, architecture, or other environmental elements to make the moment visually understandable and grounded in a real place.

        The environment should support the main action rather than overpower it.

        Do NOT isolate the person against empty space when the moment naturally belongs inside a setting.

        The people, objects, and environment should feel like one connected illustrated composition.

        TRANSPARENCY:
        The illustration must be generated on a transparent canvas, but transparency should apply primarily OUTSIDE the overall scene.

        Do NOT treat every empty gap inside the scene as transparent cutout space.

        Do NOT create transparent holes between:
        - people
        - objects
        - furniture
        - environmental elements
        - background sketch elements

        The interior of the illustrated scene should remain visually connected.

        Use faint graphite shading, loose environmental strokes, light hatching, or soft tonal sketch marks where needed to keep interior scene space coherent.

        There must still be:
        - no solid white rectangular page
        - no solid colored background
        - no hard rectangular canvas
        - no frame
        - no opaque page surrounding the illustration

        The overall scene should exist as one irregular graphite composition floating on transparency.

        The transparent area should primarily surround the OUTER boundary of the complete scene.

        EDGES:
        The illustration must NOT look like a rectangular image that was cut out and pasted into the diary.

        Do not abruptly crop:
        - bodies
        - furniture
        - objects
        - hair
        - clothing
        - graphite shadows
        - environmental sketch marks

        against an invisible image boundary.

        Toward the OUTER edges of the complete scene, gradually reduce the density of the drawing.

        Allow the environment and outermost scene elements to dissolve naturally through:
        - increasingly light strokes
        - broken contours
        - sparse hatching
        - unfinished pencil marks
        - fading graphite buildup
        - soft graphite smudging

        The center and interior of the scene should remain coherent and readable.

        Only the outer boundary should gradually fade into transparent space.

        The final result should feel like a complete scene sketched directly into a diary, with the environment softly disappearing around its edges rather than being enclosed inside a rectangular background.

        Do not include text, captions, notebook lines, frames, borders, watermarks, checkerboards, or simulated transparency.

        Output only the complete graphite diary illustration on transparency.
        """

        result = client.images.edit(
            model="gpt-image-2",
            image=image_files,
            prompt=prompt,
            output_format="png"
        )
        image_bytes = base64.b64decode(result.data[0].b64_json)
        with open("./generated/illustration-output.png", "wb") as f:
            f.write(image_bytes)
    finally:
        for image_file in image_files:
            image_file.close()
    return {"generated_image": "./generated/illustration-output.png"}

graph = StateGraph(AgentState)

graph.add_node("people_identification", people_identification)
graph.add_node("plan_illustration", plan_illustration)
graph.add_node("generate_image", generate_image)

graph.add_edge(START, "people_identification")
graph.add_conditional_edges(
    "people_identification",
    should_interrupt,
    {
        "don't interrupt": "plan_illustration",
        "interrupt": END
    }
)

graph.add_edge("plan_illustration", "generate_image")
graph.add_edge("generate_image", END)

app = graph.compile()

# with open("graph.png", "wb") as f:
#     f.write(app.get_graph().draw_mermaid_png())

