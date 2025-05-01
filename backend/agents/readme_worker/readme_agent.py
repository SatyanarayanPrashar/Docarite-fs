from termcolor import colored
from backend.agents.readme_worker.readme_graph_state import State
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig
from backend.agents.readme_worker.readme_tool import readme_tools
from backend.utils.system_prompt import system_prompt

import os
from dotenv import load_dotenv
from termcolor import colored
import openai

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set.")

client = openai.OpenAI(api_key=openai_api_key)

def agent_worker(state: State, config: RunnableConfig) -> State:
    """Invokes the LLM agent to decide the next action or generate the README."""
    print(colored("--- Agent Worker ---", "blue"))
    repo_name = state.get("repo_name", "unknown_repo")
    file_structure = state.get("file_structure", "Not available.")

    formatted_system_prompt = system_prompt.readme_prompt.format(
        file_structure=file_structure,
        repo_name=repo_name
    )

    # Prepare messages for the LLM: System Prompt + Current History
    messages = [SystemMessage(content=formatted_system_prompt)] + state["messages"]

    model = ChatOpenAI(model="gpt-4o-mini", streaming=False, api_key=openai_api_key)
    model_with_tools = model.bind_tools(readme_tools)

    # Invoke the model
    print(colored("Agent: Invoking LLM...", "magenta"))
    response = model_with_tools.invoke(messages, config=config)
    print(colored(f"Agent: LLM Response: {response.content}", "magenta"))
    if response.tool_calls:
        print(colored(f"Agent: LLM initiated tool calls: {response.tool_calls}", "magenta"))

    return {"messages": [response]}