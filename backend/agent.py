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

class PersonIdentificationResult(BaseModel):
    people_mentioned_ids: list[int]
    people_missing_names: list[str]

model = ChatOpenAI(model="gpt-5.6-luna", api_key=setting.OPENAI_API_KEY)

class AgentState(TypedDict):
    snippet :str
    people :List[dict]
    people_mentioned_ids :List[int]
    people_missing_names :List[str]
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

        A person should only count as present if they are actually participating in or physically present during the event being illustrated.

        Do not count people who are only mentioned, remembered, discussed, called, texted, or referred to as part of another story unless they are also physically present in the current scene.

        Do not invent identities. Do not assume two people are the same unless the provided information gives enough evidence to make that match.

        Return exactly these two fields:

        present_person_ids: a list of the integer IDs of stored people who are present in the scene.

        missing_people_names: a list of names for people who are present in the scene but do not have a matching stored-person record.

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

graph = StateGraph(AgentState)

graph.add_node("people_identification", people_identification)

graph.add_edge(START, "people_identification")
graph.add_edge("people_identification", END)

app = graph.compile()

result = app.invoke({
    "snippet": """Today I went to the mall with Sara and my cousin Adam.
                We got food and then Adam convinced us to go bowling.""",
    "people": [
        {
            "id": 17,
            "name": "Sara",
            "relationship": "friend"
        },
        {
            "id": 31,
            "name": "Omar",
            "relationship": "friend"
        }
    ]
})

print(result)

