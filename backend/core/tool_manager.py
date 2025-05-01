from tools.create_tools import read_file_content
from tools.execution_tools import read_plan_file, run_command, update_plan_file
from tools.rag_tools import recall_code, recall_doc
from tools.structure_tools import read_structure, update_structure_file, list_output_structure

tools = {
    "command_tool": {
        "fn": run_command,
        "description": "Runs a shell command and returns the result."
    },
    "read_file_content": {
        "fn": read_file_content,
        "description": "Reads the content of the file specified on path."
    },
    "recall_code": {
        "fn": recall_code,
        "description": "Searches the codebase for specific function/feature to get more context"
    },
    "read_plan_file": {
        "fn": read_plan_file,
        "description": "Reads the content of the plan file."
    },
    "update_plan_file": {
        "fn": update_plan_file,
        "description": "Updates the plan file with the given step."
    },
    "list_output_structure": {
        "fn": list_output_structure,
        "description": "Returns the structure of the output folder in a tree format."
    },
    "read_structure": {
        "fn": read_structure,
        "description": "Reads the content of the plan file."
    },
    "update_structure_file": {
        "fn": update_structure_file,
        "description": "Updates the plan file with the given step."
    },
}