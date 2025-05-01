import json
from dotenv import load_dotenv
import os
import openai

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def base_llm_call(messages: list, model: str = "o4-mini"):
    """
    Calls the OpenAI API with the provided messages and model.
    
    Args:
        messages (list): List of messages to send to the API.
        model (str): The model to use for the API call. Defaults to "gpt-4o-mini".
    
    Returns:
        str: The response from the API.
    """
    try:
        response = client.chat.completions.create(
            model=model,
            response_format={"type": "json_object"},
            messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in base_llm_call: {e}")
        return None