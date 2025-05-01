import os
from dotenv import load_dotenv
import openai

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition

from agents.readme_worker.readme_agent import agent_worker
from agents.readme_worker.readme_tool import readme_tools
from agents.readme_worker.readme_graph_state import State
from tools.create_tools import clone_repo, get_structure

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set.")

client = openai.OpenAI(api_key=openai_api_key)

# Define the base directory for cloning repositories
CLONE_BASE_DIR = os.path.join(os.getcwd(), "clone_repos")
os.makedirs(CLONE_BASE_DIR, exist_ok=True)

# --- Graph Nodes ---
tool_node = ToolNode(readme_tools)
graph_builder = StateGraph(State)

graph_builder.set_entry_point("clone_repo")
graph_builder.add_node("clone_repo", clone_repo)
graph_builder.add_node("get_structure", get_structure)
graph_builder.add_node("agent_worker", agent_worker)
graph_builder.add_node("execute_tools", tool_node)

graph_builder.add_edge("clone_repo", "get_structure")
graph_builder.add_edge("get_structure", "agent_worker")

graph_builder.add_conditional_edges(
    "agent_worker",
    # The routing function (tools_condition) checks the last message
    # for tool calls.
    tools_condition,
    {
        "tools": "execute_tools",
        END: END
    }
)

graph_builder.add_edge("execute_tools", "agent_worker")

graph = graph_builder.compile()

def readme_generator(git_repo_url: str):
    # git_repo_url = "https://github.com/SatyanarayanPrashar/edloops-quiz"
    
    initial_state = {"messages": [], "git_url": git_repo_url}

    print(f"Starting graph execution for URL: {git_repo_url}")

    # config = {"recursion_limit": 15}
    for event in graph.stream(initial_state):
        for node, output in event.items():
            print(f"--- Output from node: {node} ---")
            # print(output) # Print the full state changes if needed
            if "messages" in output and len(output['messages']) > 0:
                 print(f"Last Message: {output['messages'][-1].content}")
            if "repo_path" in output and output["repo_path"]:
                 print(f"Repo Path: {output['repo_path']}")
            if "file_structure" in output and output["file_structure"]:
                 print(f"File Structure generated.")
            print("-----------------------------")

    print("Readme Graph execution finished.")
    file_path = os.path.join(os.getcwd(), "output/readme.md")
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            readme_content = file.read()
        # Clear the file after reading its content
        with open(file_path, "w") as file:
            file.truncate(0)
        return {"readme": readme_content}
    else:
        raise FileNotFoundError(f"Readme file not found at {file_path}")
