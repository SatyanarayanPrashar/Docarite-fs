import os
import requests
from openai import OpenAI
from dotenv import load_dotenv
from llm_services.prompt import system_prompt

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def analyse_pr(payload, access_token):
    pr_title = payload["pull_request"]["title"]
    pr_body = payload["pull_request"]["body"] or ""
    pr_url = payload["pull_request"]["url"]

    #Get the files changed in the PR
    files_url = pr_url + "/files"
    headers = {
        "Authorization": f"token {access_token}",
        "Accept": "application/vnd.github+json"
    }

    try:
        response = requests.get(files_url, headers=headers)
        response.raise_for_status()
        files_changed = response.json()

        # Get only the patch from first few files (limiting for token usage)
        patches = []
        for file in files_changed[:3]:  # limit to 3 files
            filename = file.get("filename", "")
            patch = file.get("patch")
            if patch:
                patches.append(f"File: {filename}\n{patch}")

        code_changes = "\n\n".join(patches)

    except Exception as e:
        print(f"Error fetching file diffs: {e}")
        return None

    # Format messages for GPT-4o-mini
    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user",
            "content": f"Title: {pr_title}\n\nDescription: {pr_body}\n\nChanges:\n{code_changes}"
        }
    ]

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.4
        )
        return completion.choices[0].message.content

    except Exception as e:
        print(f"Error from OpenAI: {e}")
        return None
