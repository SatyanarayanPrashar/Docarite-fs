import os
from pathlib import Path
from langchain.docstore.document import Document
from termcolor import colored

# Define files/directories/extensions to skip
SKIP_EXTENSIONS = {
    ".env", ".lock", ".yml", ".yaml", ".json", ".md", ".mjs", ".png", ".jpg",
    ".jpeg", ".gif", ".svg", ".ico", ".toml", ".sum", ".mod", ".lockb",
    ".gitignore", ".gitattributes", ".html", ".css", ".xml", ".txt", ".cfg",
    ".ini", ".map", ".log"
    }
SKIP_FILES = {"README.md", "tsconfig.json", "package-lock.json", "docker-compose.yml", "Dockerfile"}
SKIP_DIRS = {".git", "assets", "node_modules", "__pycache__", "dist", "build", "coverage", ".venv", "venv", ".vscode", ".idea"}

def is_valid_file(file_path: Path):
    """Checks if a file should be processed based on predefined skip lists."""
    if any(part in SKIP_DIRS for part in file_path.parts):
        return False
    if file_path.name in SKIP_FILES:
        return False
    if file_path.suffix.lower() in SKIP_EXTENSIONS:
        return False
    return True

def collect_documents_from_repo(repo_path: str) -> list[Document]:
    """
    Walks through the repository, reads valid files, and creates Document objects.

    Args:
        repo_path (str): The path to the cloned repository.

    Returns:
        list[Document]: A list where each Document contains the full content of a valid file.
    """
    repo_path_obj = Path(repo_path)
    documents = []
    processed_files = 0
    skipped_files = 0

    print(colored(f"Starting document collection from: {repo_path_obj}", "cyan"))

    if not repo_path_obj.is_dir():
        print(colored(f"Error: Provided path '{repo_path}' is not a valid directory.", "red"))
        return []

    for root, dirs, files in os.walk(repo_path_obj, topdown=True):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

        for file in files:
            full_path = Path(root) / file
            relative_path = full_path.relative_to(repo_path_obj) # Get path relative to repo root

            if is_valid_file(full_path):
                try:
                    with open(full_path, "r", encoding="utf-8", errors='ignore') as f:
                        content = f.read()
                    if content.strip():
                        doc = Document(
                            page_content=content,
                            metadata={
                                "source": str(relative_path),
                                "full_path": str(full_path),
                                "extension": full_path.suffix.lower(),
                                "filename": file,
                            }
                        )
                        documents.append(doc)
                        processed_files += 1
                    else:
                        skipped_files += 1

                except FileNotFoundError:
                     print(colored(f"⚠️ File not found (might have been removed during walk): {relative_path}", "yellow"))
                     skipped_files += 1
                except Exception as e:
                    print(colored(f"⚠️ Skipped reading {relative_path} due to error: {e}", "yellow"))
                    skipped_files += 1
            else:
                skipped_files += 1

    print(colored(f"✅ Collected content from {processed_files} valid files.", "green"))
    if skipped_files > 0:
         print(colored(f"ℹ️ Skipped {skipped_files} files (empty, filtered, or errors).", "blue"))

    return documents

def splitter_main(path: str) -> list[Document]:
    """
    Main function for the splitting module. Collects documents without further splitting.

    Args:
        path (str): The path to the repository directory.

    Returns:
        list[Document]: A list of Document objects, one per valid file.
    """
    if not path:
        print(colored("Error: Repository path cannot be empty.", "red"))
        return []

    docs = collect_documents_from_repo(path)
    print(colored(f"📄 Returning {len(docs)} documents (1 per file). No further splitting applied.", "cyan"))

    return docs