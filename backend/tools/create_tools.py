import os

def create_directory_in_output(directory_name: str):
    """
    Creates a directory in the output folder if it doesn't already exist.

    Args:
        directory_name (str): The name of the directory to worker_docarite.
    """
    current_directory = os.getcwd()
    output_directory = os.path.join(current_directory, "output", directory_name)

    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
        print(f"Directory '{directory_name}' created in 'output' folder.")
    else:
        print(f"Directory '{directory_name}' already exists in 'output' folder.")
    return {"status": "success", "message": f"Directory '{directory_name}' created in 'output' folder."}

def create_file_in_directory(directory_path: str, file_name: str, content: str):
    """
    Creates a file in the specified directory with the given content.

    Args:
        directory_path (str): The path to the directory where the file will be created.
        file_name (str): The name of the file to worker_docarite.
        content (str): The content to write to the file.
    """
    current_directory = os.getcwd()

    if "output" in os.path.normpath(directory_path).split(os.sep):
        output_directory = os.path.join(current_directory, directory_path)
    else:
        output_directory = os.path.join(current_directory, "output", directory_path)

    os.makedirs(output_directory, exist_ok=True)
    
    file_path = os.path.join(output_directory, file_name)
    
    if isinstance(content, str):
        content = content.encode().decode('unicode_escape')
    
    with open(file_path, "w") as file:
        file.write(content)
    
    print(f"File '{file_name}' created in '{directory_path}'.")
    return {"status": "success", "message": f"File '{file_name}' created in '{directory_path}'."}

def read_file_content(file_path: str):
    """
    Reads the content of a file.
    
    Args:
        file_path (str): The path to the file to read.
        
    Returns:
        str: The content of the file.
    """
    # path = "/Users/satya/Desktop/pythonProjects/docfish/clone_repos/code-graph-backend/" + file_path
    with open(file_path, "r") as file:
        content = file.read()
    
    if not content:
        return "This file is either empty or does not exist. Please read file_structutre field using read_plan_file tool."

    return content
    