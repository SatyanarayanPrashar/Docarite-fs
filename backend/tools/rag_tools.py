from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from dotenv import load_dotenv
import os
import openai

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key

embedder = OpenAIEmbeddings(
    model="text-embedding-3-large",
    api_key=api_key
)


def recall_code(term: str):
    """
    Searches the codebase vector store for context related to the input term.
    """
    retriever = QdrantVectorStore.from_existing_collection(
        url="http://localhost:6333",
        collection_name="code-graph-backend",
        embedding=embedder
    )
    
    if not term or not isinstance(term, str):
        print("Warning: recall_code received invalid input term.")
        return []

    print(f"Recall Code - Searching for: {term}")
    try:
        search_result = retriever.similarity_search(
            query=term
        )
        print(f"Recall Code - Found {len(search_result)} results.")
    except Exception as e:
        print(f"Error during similarity search: {e}")
        return []
    
    # for i in search_result:
    #     print(f"Recall Code - Search result: {i} \n")

    return (search_result)

def recall_doc(term: str):
    print("recalling doc")
    return "No document found, will need to worker_docarite from scratch."