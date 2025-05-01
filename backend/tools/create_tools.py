import os
from termcolor import colored
import subprocess

from langchain_core.messages import HumanMessage
from agents.readme_worker.readme_graph_state import State

def read_file_content(file_path: str) -> str:
    """
    Reads the content of a specified file.
    Args:
        file_path (str): The full path to the file to read (e.g., 'clone_repos/my-repo/src/main.py').
    Returns:
        str: The content of the file or an error message.
    """
    try:
        # Security check: Ensure the path is within the allowed directory
        abs_file_path = os.path.abspath(file_path)
        abs_clone_dir = os.path.abspath(CLONE_BASE_DIR)
        if not abs_file_path.startswith(abs_clone_dir):
             return f"Error: Access denied. Can only read files within '{CLONE_BASE_DIR}'."
        
        if not os.path.exists(abs_file_path):
            return f"Error: File not found at '{file_path}'"
        if not os.path.isfile(abs_file_path):
            return f"Error: Path '{file_path}' is not a file."
            
        with open(abs_file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        print(colored(f"Tool: Successfully read {len(content)} characters from '{file_path}'", "green"))
        # Provide context for the LLM about the file read
        return f"Content of '{file_path}':\n\n{content}"
    except Exception as e:
        print(colored(f"Tool: Error reading file '{file_path}': {e}", "red"))
        return f"Error reading file '{file_path}': {e}"

def write_file_content(content: str) -> str:
    """
    Writes content to a specified file, creating directories if necessary.
    Args:
        file_path (str): The full path to the file to write (e.g., 'clone_repos/my-repo/README.md').
        content (str): The content to write to the file.
    Returns:
        str: A success or error message.
    """
    file_path = os.path.join(os.getcwd(), "output/readme.md")
    if not os.path.exists(file_path):
        with open(file_path, "a") as f:
            f.write("")

    # print(colored(f"Tool: Writing to file '{file_path}'", "yellow"))

    try:
        with open(file_path, 'a', encoding='utf-8') as f:
            f.write(content + "\n \n")
        # print(colored(f"Tool: Successfully wrote {len(content)} characters to '{file_path}'", "green"))
        return f"Successfully wrote content to '{file_path}'."
    except Exception as e:
        # print(colored(f"Tool: Error writing file '{file_path}': {e}", "red"))
        return f"Error writing file '{file_path}': {e}"

CLONE_BASE_DIR = os.path.join(os.getcwd(), "clone_repos")
os.makedirs(CLONE_BASE_DIR, exist_ok=True)

def clone_repo(state: State) -> State:
    """Clones the repository specified in the state's git_url."""
    print(colored("--- Cloning Repository ---", "blue"))
    git_url = state.get("git_url")
    if not git_url:
        state["messages"] = [HumanMessage(content="Error: No Git URL provided.")]
        print(colored("Error: No Git URL provided.", "red"))
        return {**state, "repo_path": None, "repo_name": None}

    try:
        repo_name = git_url.split('/')[-1]
        if repo_name.endswith('.git'):
            repo_name = repo_name[:-4]
        
        repo_path = os.path.join(CLONE_BASE_DIR, repo_name)

        if os.path.exists(repo_path) and os.path.exists(os.path.join(repo_path, '.git')):
             print(colored(f"Repository '{repo_name}' already exists at '{repo_path}'. Skipping clone.", "yellow"))
        else:
            print(colored(f"Cloning '{git_url}' into '{repo_path}'...", "cyan"))
            result = subprocess.run(['git', 'clone', git_url, repo_path], capture_output=True, text=True, check=False)

            if result.returncode != 0:
                error_message = f"Error cloning repository: {result.stderr}"
                print(colored(error_message, "red"))
                state["messages"] = state.get("messages", []) + [HumanMessage(content=error_message)]
                return {**state, "repo_path": None, "repo_name": None}

            print(colored(f"Successfully cloned '{repo_name}'.", "green"))

        return {**state, "repo_path": repo_path, "repo_name": repo_name}

    except Exception as e:
        error_message = f"An unexpected error occurred during cloning: {e}"
        print(colored(error_message, "red"))
        state["messages"] = state.get("messages", []) + [HumanMessage(content=error_message)]
        return {**state, "repo_path": None, "repo_name": None}
    
def get_structure(state: State) -> dict:
    """Generates a file structure tree for the cloned repository."""
    print(colored("--- Generating File Structure ---", "blue"))
    repo_path = state.get("repo_path")
    repo_name = state.get("repo_name")
    messages = state.get("messages", []) 

    if not repo_path or not os.path.exists(repo_path):
        error_message = "Error: Cannot generate structure, repository not cloned successfully or path invalid."
        print(colored(error_message, "red"))
        # Return updates for the state dictionary
        return {"messages": messages + [HumanMessage(content=error_message)], "file_structure": "Error: Repository not found."}

    structure = f"File structure for repository '{repo_name}' located at base '{CLONE_BASE_DIR}':\n\n"
    structure += f"{repo_name}/\n" # Start with the repo root directory name

    # Walk through the directory
    for root, dirs, files in os.walk(repo_path):
        # Skip .git directory and other common large/binary directories
        dirs[:] = [d for d in dirs if d not in ['.git', '__pycache__', 'node_modules', '.venv', 'venv']]
        
        # Calculate indentation level relative to repo_path
        relative_path = os.path.relpath(root, repo_path)
        if relative_path == '.':
            level = 0
        else:
            level = relative_path.count(os.sep) + 1 # +1 because root is level 0

        indent = ' ' * 4 * (level) + '|-- '

        # Print directory name (only if it's not the root level itself)
        if level > 0 : 
             sub_dir_name = os.path.basename(root)
             structure += f"{indent}{sub_dir_name}/\n"
        
        # Print file names
        sub_indent = ' ' * 4 * (level + 1) + '|-- '
        for f in files:
             # Optional: Add filters for file types if needed
             structure += f"{sub_indent}{f}\n"
             
    # Limit structure size if it gets too large (optional)
    max_structure_len = 10000 
    if len(structure) > max_structure_len:
        structure = structure[:max_structure_len] + "\n... (structure truncated)"


    print(colored(f"Generated structure (first 500 chars):\n{structure[:500]}...", "cyan"))
    # Return updates for the state dictionary
    return {"file_structure": structure}