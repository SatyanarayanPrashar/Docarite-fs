import json
import os
from termcolor import colored

def update_structure_file(new_structure: str):
    """
    Updates the structure file with the new structure.

    Args:
        new_structure (str): The new structure to update in the file.
    """
    structure_file_path = "file_structure.txt"

    # Write the new structure to the file
    with open(structure_file_path, "w") as file:
        file.write(new_structure)

    print(f"Structure file updated with new structure.")
    return "Structure file updated"

def read_structure(dummy: str):
    """
    Reads the content of the structure file.

    Args:
        dummy (str): Dummy argument to match the function signature.
    """
    structure_file_path = "file_structure.txt"

    # Read the content of the structure file
    with open(structure_file_path, "r") as file:
        content = file.read()

    print(f"Structure file read.")
    return content

def generate_tree(directory, prefix="", skip_names=None, skip_endings=None):
    """
    Recursively generate a tree structure string for a given directory.
    """
    if skip_names is None:
        skip_names = {"node_modules", "venv", "static", "media", "asset", ".DS_Store", "__pycache__", "__init__"}
    if skip_endings is None:
        skip_endings = {".git", ".github", ".idea", ".vscode", ".gitignore", ".env"}

    tree = ""
    try:
        entries = []
        all_entries = sorted(os.listdir(directory))
        for entry in all_entries:
            if entry in skip_names or any(entry.endswith(ending) for ending in skip_endings):
                continue
            entries.append(entry)

        for index, entry in enumerate(entries):
            entry_path = os.path.join(directory, entry)
            is_last = index == len(entries) - 1
            connector = "└── " if is_last else "├── "
            tree += prefix + connector + entry + "\n"

            if os.path.isdir(entry_path):
                extension = "    " if is_last else "│   "
                tree += generate_tree(entry_path, prefix + extension, skip_names, skip_endings)

    except OSError as e:
        tree += f"{prefix}└── [Error accessing directory: {e}]\n"

    return tree

def list_output_structure(dummy: str = None) :
    """
    Lists the structure of the output folder in a tree format.
    """
    print(colored(f"Listing the structure of the output folder... {dummy}", "green"))
    current_directory = os.getcwd()
    output_directory = os.path.join(current_directory, "clone_repos")

    if not os.path.exists(output_directory):
        # return {"status": "error", "message": "Output directory does not exist."}
        print({"status": "error", "message": "Output directory does not exist."})

    tree_structure = generate_tree(output_directory)

    data = {}
    data["file_structure"] = tree_structure
    with open("plan.json", 'w') as file:
        json.dump(data, file, indent=4)
    with open("file_structure.txt", 'w') as file:
        file.write(tree_structure)

    return (f"Output folder structure:\n{tree_structure}")
