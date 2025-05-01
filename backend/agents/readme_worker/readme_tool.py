from langchain_core.tools import Tool
from tools.create_tools import read_file_content, write_file_content

readme_tools = [
    Tool.from_function(read_file_content, name="read_file_content", description="Read the content of a specific file within the cloned repository. Provide the full path relative to the base directory (e.g., 'clone_repos/repo_name/file.py')."),
    Tool.from_function(write_file_content, name="write_file_content", description="Write content to a specific file within the cloned repository (e.g., 'clone_repos/repo_name/README.md'). This will overwrite existing files or create new ones."),
]