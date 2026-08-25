from typing import TypedDict, Annotated, Sequence
from langgraph.graph import StateGraph, START, END 
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage, SystemMessage
from langchain_core.tools import tool
from IPython.display import Image, display
from settings import setting

model = ChatOpenAI(model="gpt-4o", api_key=setting.OPENAI_API_KEY)

print(model.invoke([HumanMessage(content="Hi")]).content)
