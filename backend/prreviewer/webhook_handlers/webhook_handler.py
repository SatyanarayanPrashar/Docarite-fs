# views.py
import re
from django.http import JsonResponse
from django.shortcuts import redirect
import hmac, hashlib, json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseForbidden
import time
import os
from dotenv import load_dotenv
import jwt
import requests
import logging
from llm_services.llm_call import analyse_pr

load_dotenv()
from pathlib import Path

GITHUB_INSTALLATION_REDIRECT_URL = os.getenv("GITHUB_INSTALLATION_REDIRECT_URL")
APP_ID = os.getenv("GITHUB_APP_ID")
BASE_DIR = Path(__file__).resolve().parent.parent
PEM_PATH = BASE_DIR / 'docarite.2025-06-14.private-key.pem'

with open(PEM_PATH, 'r') as f:
    PRIVATE_KEY = f.read()

logger = logging.getLogger(__name__)

class GitHubWebhookHandler:
    def __init__(self, request):
        self.request = request
        self.secret = b'mysecret123'
        self.jwt_token = None
        self.access_token = None
        self.payload = None
        self.event = None
        self.repo = None
        self.pr_number = None
        self.installation_id = None

    def handle(self):
        if not self._is_valid_signature():
            return HttpResponseForbidden("Invalid or missing signature")

        if not self._parse_event_payload():
            return JsonResponse({"error": "Invalid payload"}, status=400)

        if self.event == "pull_request" and self.payload.get("action") in ["opened", "reopened"]:
            return self._handle_pull_request()

        return JsonResponse({"status": "ok"})

    def _is_valid_signature(self):
        signature = self.request.headers.get('X-Hub-Signature-256')
        if not signature:
            logger.warning("Request rejected: Signature missing")
            return False
        try:
            computed_sig = 'sha256=' + hmac.new(self.secret, self.request.body, hashlib.sha256).hexdigest()
            if not hmac.compare_digest(signature, computed_sig):
                logger.warning("Request rejected: Signature mismatch")
                return False
        except Exception as e:
            logger.error(f"Error validating signature: {e}")
            return False
        return True

    def _parse_event_payload(self):
        try:
            self.event = self.request.headers.get("X-GitHub-Event", "")
            self.payload = json.loads(self.request.body)
            return True
        except Exception as e:
            logger.error(f"Error parsing payload: {e}")
            return False

    def _create_jwt(self):
        now = int(time.time())
        payload = {
            "iat": now,
            "exp": now + 540,
            "iss": APP_ID
        }
        try:
            self.jwt_token = jwt.encode(payload, PRIVATE_KEY, algorithm="RS256")
        except Exception as e:
            logger.error(f"JWT encoding failed: {e}")
            return False
        return True

    def _get_access_token(self):
        headers = {
            "Authorization": f"Bearer {self.jwt_token}",
            "Accept": "application/vnd.github+json"
        }
        try:
            url = f"https://api.github.com/app/installations/{self.installation_id}/access_tokens"
            res = requests.post(url, headers=headers)
            res.raise_for_status()
            self.access_token = res.json().get("token")
            return self.access_token is not None
        except Exception as e:
            logger.error(f"Failed to get access token: {e}")
            return False

    def _handle_pull_request(self):
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
    
    def fetch_linked_issue(repo_full_name, issue_number, access_token):
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

    def _fetch_issue_info(self):
        pr_body = self.payload["pull_request"].get("body", "")
        linked_issues = re.findall(r"(?:Issue|Fixes|Closes|Resolves)[:\s]*#(\d+)", pr_body, re.IGNORECASE)
        if not linked_issues:
            logger.info("No linked issues found in PR description.")
            return None
        return self.fetch_linked_issue(self.repo, linked_issues[0], self.access_token)

    def _post_comment(self, text):
        url = f"https://api.github.com/repos/{self.repo}/issues/{self.pr_number}/comments"
        headers = {
            "Authorization": f"token {self.access_token}",
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
