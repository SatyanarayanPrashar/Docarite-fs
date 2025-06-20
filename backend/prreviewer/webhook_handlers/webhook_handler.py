import re
from django.http import JsonResponse
from django.http import JsonResponse, HttpResponseForbidden
import os
from dotenv import load_dotenv
import requests
import logging
from webhook_handlers.github_authenticator import EventParser, GitHubAuthenticator, SignatureValidator
from llm_services.llm_call import LLM_Services

load_dotenv()
from pathlib import Path

GITHUB_INSTALLATION_REDIRECT_URL = os.getenv("GITHUB_INSTALLATION_REDIRECT_URL")
APP_ID = os.getenv("GITHUB_APP_ID")
PVT_KEY = os.getenv("PVT_KEY")
GIT_SECRET_KEY = os.getenv("GIT_SECRET_KEY")
BASE_DIR = Path(__file__).resolve().parent.parent
PEM_PATH = BASE_DIR / PVT_KEY

with open(PEM_PATH, 'r') as f:
    PRIVATE_KEY = f.read()

logger = logging.getLogger(__name__)


class GitHubWebhookHandler:
    def __init__(self, request):
        self.request = request
        self.secret = GIT_SECRET_KEY.encode() if GIT_SECRET_KEY else b"default_fallback_secret"
        self.parser = EventParser(request)
        self.validator = SignatureValidator(request, self.secret)
        self.auth = GitHubAuthenticator(APP_ID, PRIVATE_KEY)
        self.llm = LLM_Services()

    def handle(self):
        if not self.validator.is_valid():
            return HttpResponseForbidden("Invalid or missing signature")

        event, payload = self.parser.parse()
        if not event or not payload:
            return JsonResponse({"error": "Invalid payload"}, status=400)

        if event == "pull_request" and payload.get("action") in ["opened", "reopened"]:
            return self.handle_pull_request(payload)
        elif event == "pull_request" and payload.get("action") == "synchronize":
            return self.process_commit_feedback(payload)

        return JsonResponse({"status": "ok"})

    def handle_pull_request(self, payload):
        try:
            repo = payload["repository"]["full_name"]
            pr_number = payload["pull_request"]["number"]
            installation_id = payload["installation"]["id"]
        except KeyError as e:
            logger.error(f"Missing key in payload: {e}")
            return JsonResponse({"error": f"Missing key {e}"}, status=400)

        jwt_token = self.auth.create_jwt()
        if not jwt_token:
            return JsonResponse({"error": "JWT creation failed"}, status=500)

        access_token = self.auth.get_installation_token(jwt_token, installation_id)
        if not access_token:
            return JsonResponse({"error": "Access token missing"}, status=502)

        pr_body = payload["pull_request"].get("body", "")
        linked_issues = re.findall(r"(?:Issue|Fixes|Closes|Resolves)[:\s]*#(\d+)", pr_body, re.IGNORECASE)

        pr_info = None
        if linked_issues:
            pr_info = self.fetch_pr_info(repo, pr_number, access_token)

        issue_info = self.fetch_linked_issue(repo, linked_issues[0], access_token)

        try:
            comment_text = self.llm.analyse_pr(pr_info, issue_info) or "Thank you for your contribution 🚀!"
        except Exception as e:
            logger.error(f"Error analysing PR: {e}")
            comment_text = "Thank you for your contribution 🚀!"

        return self.post_comment(repo, pr_number, access_token, comment_text)

    def post_comment(self, repo, pr_number, access_token, text):
        url = f"https://api.github.com/repos/{repo}/issues/{pr_number}/comments"
        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json"
        }
        try:
            res = requests.post(url, headers=headers, json={"body": text})
            res.raise_for_status()
            logger.info("Comment posted successfully")
            return JsonResponse({"status": "commented"})
        except Exception as e:
            logger.error(f"Failed to post comment: {e}")
            return JsonResponse({"error": "Failed to post comment"}, status=502)



        try:
            self.repo = self.payload["repository"]["full_name"]
            self.pr_number = self.payload["pull_request"]["number"]
            self.installation_id = self.payload["installation"]["id"]
        except KeyError as e:
            logger.error(f"Missing key in payload: {e}")
            return JsonResponse({"error": f"Missing key {e}"}, status=400)

        if not self._create_jwt():
            return JsonResponse({"error": "JWT creation failed"}, status=500)
        if not self._get_access_token():
            return JsonResponse({"error": "Access token missing"}, status=502)

        issue_info = self._fetch_issue_info()

        try:
            comment_text = analyse_pr(self.payload, self.access_token, issue_info) or "Thank you for your contribution 🚀!"
        except Exception as e:
            logger.error(f"Error analysing PR: {e}")
            comment_text = "Thank you for your contribution 🚀!"

        return self._post_comment(comment_text)
    
    def fetch_linked_issue(self, repo_full_name, issue_number, access_token):
        """
        Fetch issue details from a GitHub repository.

        Args:
            repo_full_name (str): The full repo name (e.g. "owner/repo")
            issue_number (str or int): The issue number to fetch
            access_token (str): GitHub access token (installation token)

        Returns:
            dict: Parsed issue data (title, body, state, etc.)
            None: If fetch fails
        """
        issue_url = f"https://api.github.com/repos/{repo_full_name}/issues/{issue_number}"
        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json"
        }

        try:
            response = requests.get(issue_url, headers=headers)
            response.raise_for_status()
            issue_data = response.json()
            return {
                "title": issue_data.get("title"),
                "body": issue_data.get("body"),
                "state": issue_data.get("state"),
                "url": issue_data.get("html_url"),
            }
        except requests.RequestException as e:
            logger.error(f"Failed to fetch issue #{issue_number}: {e}")
            return None

    def fetch_pr_info(self, repo_full_name, pr_number, access_token):
        pr_url = f"https://api.github.com/repos/{repo_full_name}/pulls/{pr_number}"
        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json"
        }

        files_url = pr_url + "/files"
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
            logger.error(f"Error fetching file diffs: {e}")
            return None

        try:
            response = requests.get(pr_url, headers=headers)
            response.raise_for_status()
            pr_data = response.json()
            return {
                "title": pr_data.get("title"),
                "body": pr_data.get("body"),
                "url": pr_data.get("html_url"),
                "code_changes": code_changes
            }
        except requests.RequestException as e:
            logger.error(f"Failed to fetch PR #{pr_number}: {e}")
            return None

    def process_commit_feedback(self, payload):
        try:
            repo = payload["repository"]["full_name"]
            latest_commit_sha = payload["pull_request"]["head"]["sha"]
            pr_number = payload["pull_request"]["number"]
            installation_id = payload["installation"]["id"]
        except KeyError as e:
            logger.error(f"Missing key in payload: {e}")
            return JsonResponse({"error": f"Missing key {e}"}, status=400)

        jwt_token = self.auth.create_jwt()
        if not jwt_token:
            return JsonResponse({"error": "JWT creation failed"}, status=500)

        access_token = self.auth.get_installation_token(jwt_token, installation_id)
        if not access_token:
            return JsonResponse({"error": "Access token missing"}, status=502)
        
        review_info = self.fetch_commit_comment(repo, pr_number, latest_commit_sha, access_token)

        if not review_info:
            return JsonResponse({"error": "Failed to fetch review info"}, status=502)

        try:
            comment_text = self.llm.analyse_commit_changes(
                review_info.get('last_comment'),
                review_info.get('code_changes')
            )
        except Exception as e:
            logger.error(f"Error analysing PR: {e}")
            comment_text = "Thank you for your contribution 🚀!"

        return self.post_comment(repo, pr_number, access_token, comment_text)

    def fetch_commit_comment(self, repo_full_name, pr_number, latest_commit_sha, access_token):
        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json"
        }

        commit_data = {}
        comments = []

        # Fetch latest commit data
        try:
            commit_url = f"https://api.github.com/repos/{repo_full_name}/commits/{latest_commit_sha}"
            commit_res = requests.get(commit_url, headers=headers)
            commit_res.raise_for_status()
            commit_data = commit_res.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch commit data for SHA {latest_commit_sha}: {e}")
            return {
                "last_comment": "",
                "code_changes": "Failed to fetch commit data."
            }

        # Fetch comments on the PR
        try:
            comment_url = f"https://api.github.com/repos/{repo_full_name}/issues/{pr_number}/comments"
            comment_res = requests.get(comment_url, headers=headers)
            comment_res.raise_for_status()
            comments = comment_res.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch comments for PR #{pr_number}: {e}")
            return {
                "last_comment": "",
                "code_changes": "Failed to fetch PR comments."
            }

        # Extract last bot comment
        bot_name = "docarite"
        last_comment = ""
        try:
            bot_comments = [
                c for c in comments
                if c["user"]["type"] == "Bot" and bot_name.lower() in c["user"]["login"].lower()
            ]
            if bot_comments:
                last_comment = bot_comments[-1]["body"]
        except Exception as e:
            logger.warning(f"Error parsing comments for bot user: {e}")

        # Extract patches
        patches = []
        try:
            files = commit_data.get("files", [])
            for file in files[:4]:  # Limit to 4 files to keep prompt concise
                filename = file.get("filename", "")
                patch = file.get("patch")
                if patch:
                    patches.append(f"File: {filename}\n{patch}")
        except Exception as e:
            logger.warning(f"Error parsing commit diff: {e}")

        code_changes = "\n\n".join(patches) if patches else "No code changes detected."
        logger.info(f"Code changes summary prepared with {len(patches)} file(s).")

        return {
            "last_comment": last_comment,
            "code_changes": code_changes
        }