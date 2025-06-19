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
from webhook_handlers.github_authenticator import EventParser, GitHubAuthenticator, SignatureValidator
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
        self.parser = EventParser(request)
        self.validator = SignatureValidator(request, self.secret)
        self.auth = GitHubAuthenticator(APP_ID, PRIVATE_KEY)

    def handle(self):
        if not self.validator.is_valid():
            return HttpResponseForbidden("Invalid or missing signature")

        event, payload = self.parser.parse()
        if not event or not payload:
            return JsonResponse({"error": "Invalid payload"}, status=400)

        if event == "pull_request" and payload.get("action") in ["opened", "reopened"]:
            return self.handle_pull_request(payload)

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

        issue_info = None
        if linked_issues:
            issue_info = self.fetch_linked_issue(repo, linked_issues[0], access_token)

        try:
            comment_text = analyse_pr(payload, access_token, issue_info) or "Thank you for your contribution 🚀!"
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
