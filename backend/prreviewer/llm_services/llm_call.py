import os
import requests
from openai import OpenAI
from dotenv import load_dotenv
from llm_services.prompt import pr_reviewer_prompt, comment_reviewer_prompt

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

class LLM_Services:

    @staticmethod
    def analyse_pr(payload, access_token, issue_info=None):
        pr_title = payload["pull_request"]["title"]
        pr_body = payload["pull_request"]["body"] or ""
        pr_url = payload["pull_request"]["url"]

        issue_body = "No tagged issue"
        if issue_info is not None:
            issue_body = issue_info.get("body", "")

        files_url = pr_url + "/files"
        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json"
        }

        try:
            response = requests.get(files_url, headers=headers)
            response.raise_for_status()
            files_changed = response.json()

            patches = []
            for file in files_changed[:4]:
                filename = file.get("filename", "")
                patch = file.get("patch")
                if patch:
                    patches.append(f"File: {filename}\n{patch}")

            code_changes = "\n\n".join(patches)

        except Exception as e:
            print(f"Error fetching file diffs: {e}")
            return None

        messages = [
            {
                "role": "system",
                "content": pr_reviewer_prompt
            },
            {
                "role": "user",
                "content": f"Title: {pr_title}\n\nDescription: {pr_body}\n\nChanges:\n{code_changes}\n\nTagged Issue: {issue_body}"
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

    @staticmethod
    def analyse_commit_changes(last_comment, commit_data):
        files = commit_data.get("files", [])

        patches = []
        for file in files[:4]:  # Limit to 4 files to keep prompt concise
            filename = file.get("filename", "")
            patch = file.get("patch")
            if patch:
                patches.append(f"File: {filename}\n{patch}")

        code_changes = "\n\n".join(patches) if patches else "No code changes detected."

        messages = [
            {
                "role": "system",
                "content": comment_reviewer_prompt
            },
            {
                "role": "user",
                "content": (
                    f"Below is the last feedback left by the reviewer bot:\n\n"
                    f"{last_comment}\n\n"
                    f"And here are the latest code changes from the most recent commit:\n\n"
                    f"{code_changes}\n\n"
                    f"Check if the feedback has been addressed. If yes, acknowledge it. "
                    f"If not, specify what is still missing."
                )
            }
        ]

        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
            )
            print("6")
            return completion.choices[0].message.content

        except Exception as e:
            print(f"Error from OpenAI: {e}")
            return None
