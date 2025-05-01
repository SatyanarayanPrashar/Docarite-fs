from termcolor import colored
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig
from agents.readme_worker.readme_tool import readme_tools
from utils.system_prompt import system_prompt
from agents.readme_worker.readme_graph_state import State

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
    response = model_with_tools.invoke(messages, config=config)
    print(colored(f"Agent: LLM Response: {response.content}", "magenta"))
    if response.tool_calls:
        print(colored(f"Agent: LLM initiated tool calls: {response.tool_calls}", "magenta"))
  
        # for tool_call in response.tool_calls:
        #     if tool_call['name'] == "write_file_content":
        #         new_content = tool_call['args']['__arg1']
        #         new_content += "\n \n"
        #         if "result" in state:
        #             state["result"] += new_content
        #         else:
        #             state["result"] = new_content
        for tool_call in response.tool_calls:
            if tool_call['name'] == "write_file_content": # <-- Checkpoint 1
                new_content = tool_call['args']['__arg1']
                new_content += "\n \n"
                print(colored(f"  -> Detected 'write_file_content' call", "cyan"))
                print(colored(f"  -> Content to add: '{new_content[:100]}...'", "cyan"))
                if "result" in state:
                    print(colored(f"  -> Result BEFORE update: '{state['result'][:100]}...'", "cyan"))
                    state["result"] += new_content # <-- Checkpoint 2
                    print(colored(f"  -> Result AFTER update: '{state['result'][:100]}...'", "cyan"))
                else:
                    state["result"] = new_content
                    print(colored(f"  -> Result CREATED: '{state['result'][:100]}...'", "cyan"))

    return {"messages": [response]}