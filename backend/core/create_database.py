import openai
from dotenv import load_dotenv
import os
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from termcolor import colored

from core.split_data import splitter_main

load_dotenv()
openai.api_key = os.environ.get('OPENAI_API_KEY')
if not openai.api_key:
    print(colored("Error: OPENAI_API_KEY not found in environment variables.", "red"))
    print("Please ensure it's set in your .env file or environment.")
    exit(1)

CODEBASE_PATH = "path/to/your/codebase_repo"
QDRANT_URL = os.environ.get("QDRANT_URL", "http://localhost:6333")
EMBEDDING_MODEL = "text-embedding-3-large"

def load_codebase_documents(repo_path: str):
    print(colored(f"Loading documents from codebase at: {repo_path}", "cyan"))
    if not os.path.isdir(repo_path):
         print(colored(f"Error: Codebase path '{repo_path}' not found or is not a directory.", "red"))
         return []
    documents = splitter_main(path=repo_path)
    if not documents:
        print(colored("Warning: No documents were collected from the specified path.", "yellow"))
    return documents

def create_and_store_embeddings(documents: list, embedder: OpenAIEmbeddings, qdrant_url: str, collection_name: str):
    if not documents:
        print(colored("No documents to process. Skipping embedding creation and storage.", "yellow"))
        return
    print(colored(f"Initializing Qdrant client for collection '{collection_name}' at {qdrant_url}", "cyan"))
    print(colored(f"Generating embeddings using '{EMBEDDING_MODEL}' and uploading...", "cyan"))
    try:
        QdrantVectorStore.from_documents(
            documents=documents,
            embedding=embedder,
            url=qdrant_url,
            collection_name=collection_name,
        )
        print(colored(f"✅ Successfully added {len(documents)} documents to Qdrant collection '{collection_name}'.", "green"))
    except Exception as e:
        print(colored(f"Error interacting with Qdrant: {e}", "red"))
        print(colored("Please ensure Qdrant is running and accessible at the specified URL.", "yellow"))

def generate_embedding(code_path: str, repo_name: str):
    try:
        print(colored("--- Starting Codebase Embedding Pipeline ---", "magenta"))
        code_documents = load_codebase_documents(code_path)
        if not code_documents:
            print(colored("Pipeline halted as no documents were loaded.", "red"))
            return
        print(colored(f"Initializing embedding model: {EMBEDDING_MODEL}", "cyan"))
        embedder = OpenAIEmbeddings(
            model=EMBEDDING_MODEL,
            api_key=openai.api_key
        )
        create_and_store_embeddings(
            documents=code_documents,
            embedder=embedder,
            qdrant_url=QDRANT_URL,
            collection_name=repo_name
            # collection_name="lib_resume_builder_AIHawk.git"
        )
        print(colored("--- Codebase Embedding Pipeline Finished ---", "magenta"))
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return

if __name__ == "__main__":
    if CODEBASE_PATH == "path/to/your/codebase_repo":
        print(colored("Error: Please update the 'CODEBASE_PATH' variable in the script "
                      "to point to your actual codebase directory.", "red"))
    elif not os.path.exists(CODEBASE_PATH):
         print(colored(f"Error: The specified CODEBASE_PATH '{CODEBASE_PATH}' does not exist.", "red"))
    else:
        generate_embedding()
