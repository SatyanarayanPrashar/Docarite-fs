from typing import Annotated, List, TypedDict, Optional
from typing_extensions import TypedDict
from langchain_core.messages import HumanMessage, AnyMessage
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
    git_url: str
    repo_path: Optional[str]
    repo_name: Optional[str]
    file_structure: Optional[str]