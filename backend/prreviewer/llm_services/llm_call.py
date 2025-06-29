import logging
import os
import requests
from openai import OpenAI
from dotenv import load_dotenv
from llm_services.prompt import pr_reviewer_prompt, comment_reviewer_prompt

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)
logger = logging.getLogger(__name__)

class LLM_Services:

    def llm_call(self, messages):
        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.4
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error from OpenAI: {e}")
            return None

    def analyse_pr(self, pr_info, issue_info=None, preferences=None):
        issue_body = issue_info.get("body", "No tagged issue.") if issue_info else "No tagged issue."

        messages = [
            {"role": "system", "content": pr_reviewer_prompt}
        ]

        if preferences:
            lang = preferences.get("reviewLanguage", "English")
            walkthrough = preferences.get("summaryInWalkthrough", False)
            files_summary = preferences.get("changedFilesSummary", False)
            labels = preferences.get("addLabels", False)

            note_parts = [
                f"I'd like the PR to be reviewed in **{lang}**.",
                f"I {'don’t' if not walkthrough else 'do'} want walkthroughs",
                f"I {'do' if files_summary else 'don’t'} need a list of the changed files, and concise summaries of each as a table.",
                f"Please {'suggest' if labels else 'skip suggesting'} relevant labels for the PR."
            ]
            preference_note = "Note: " + " ".join(note_parts)
            print(preference_note)

        messages.append({"role": "user", "content": f"{preference_note} \n\n Title: {pr_info.get('title')}\n\nDescription: {pr_info.get('body')}\n\nChanges:\n{pr_info.get('code_changes')}\n\nTagged Issue: {issue_body}"})
        return self.llm_call(messages)

    def analyse_commit_changes(self, last_comment, code_changes):
        messages = [
            {"role": "system", "content": comment_reviewer_prompt},
            {"role": "user", "content": f"Below is the last feedback left by the reviewer bot:\n\n{last_comment}\n\nAnd here are the latest code changes from the most recent commit:\n\n{code_changes}\n\n"}
        ]
        return self.llm_call(messages)