import json
from utils.diff_parser import add_line_numbers_to_diff
from llm_services.prompt import pr_reviewer_prompt, comment_reviewer_prompt, line_by_line_reviewer_prompt
from llm_services.llm_client import LLM_Client
from utils.logger import get_logger

logger = get_logger()

class PR_Reviewer:
    def __init__(self, config=None):
        self.llm_client = LLM_Client(config)

    def analyse_pr(self, pr_info, issue_info=None, preferences=None):
        issue_body = issue_info.get("body", "No tagged issue.") if issue_info else "No tagged issue."

        messages = [
            {"role": "system", "content": pr_reviewer_prompt}
        ]
        
        preference_note = ""
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

        messages.append({"role": "user", "content": f"{preference_note} \n\n Title: {pr_info.get('title')}\n\nDescription: {pr_info.get('body')}\n\nChanges:\n{pr_info.get('code_changes')}\n\nTagged Issue: {issue_body}"})
        return self.llm_client.invoke(messages)

    def analyse_commit_changes(self, last_comment, code_changes):
        messages = [
            {"role": "system", "content": comment_reviewer_prompt},
            {"role": "user", "content": f"Below is the last feedback left by the reviewer bot:\n\n{last_comment}\n\nAnd here are the latest code changes from the most recent commit:\n\n{code_changes}\n\n"}
        ]
        return self.llm_client.invoke(messages)
    
    def analyse_pr_line_by_line(self, pr_info):
        raw_diff = pr_info.get('code_changes')
        numbered_diff = add_line_numbers_to_diff(raw_diff)

        messages = [
            {"role": "system", "content": line_by_line_reviewer_prompt},
            {"role": "user", "content": f"Changes:\n{numbered_diff}"}
        ]

        print("\n\ncode_changes:\n", numbered_diff, "\n\n")
        
        response = self.llm_client.invoke(messages)

        print("\n\nLine by line review response:\n", response, "\n\n")
        
        try:
            content = response.strip().replace("```json", "").replace("```", "")
            return json.loads(content)
        except Exception as e:
            logger.error(f"AI returned invalid JSON: {e}")
            return []
