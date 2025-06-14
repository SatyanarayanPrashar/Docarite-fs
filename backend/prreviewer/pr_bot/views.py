# views.py
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

from llm_services.llm_call import analyse_pr

load_dotenv()
from pathlib import Path

APP_ID = os.getenv("GITHUB_APP_ID")
BASE_DIR = Path(__file__).resolve().parent.parent
PEM_PATH = BASE_DIR / 'docarite.2025-06-14.private-key.pem'

with open(PEM_PATH, 'r') as f:
    PRIVATE_KEY = f.read()

def install_callback(request):
    installation_id = request.GET.get("installation_id")
    setup_action = request.GET.get("setup_action")

    # Save this installation ID to DB or link to the logged-in user
    print(f"Installation complete with ID: {installation_id}, action: {setup_action}")

    return redirect(f"http://localhost:3000/home/repositories?installation_id={installation_id}")


@csrf_exempt
def github_webhook(request):
    secret = b'mysecret123'
    signature = request.headers.get('X-Hub-Signature-256')
    if not signature:
        return HttpResponseForbidden("Signature missing")

    computed_sig = 'sha256=' + hmac.new(secret, request.body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, computed_sig):
        return HttpResponseForbidden("Signature mismatch")

    event = request.headers.get("X-GitHub-Event", "")
    payload = json.loads(request.body)

    if event == "pull_request" and payload.get("action") in ["opened", "reopened"]:
        repo = payload["repository"]["full_name"]
        issue_number = payload["pull_request"]["number"]

        now = int(time.time())
        payload_jwt = {
            "iat": now,
            "exp": now + 540,
            "iss": APP_ID
        }
        jwt_token = jwt.encode(payload_jwt, PRIVATE_KEY, algorithm="RS256")
        installation_id = payload["installation"]["id"]
        headers = {
            "Authorization": f"Bearer {jwt_token}",
            "Accept": "application/vnd.github+json"
        }
        res = requests.post(f"https://api.github.com/app/installations/{installation_id}/access_tokens", headers=headers)
        access_token = res.json()["token"]

        comment_url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/comments"
        comment_headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json"
        }
        comment_body = {
            "body": analyse_pr(payload, access_token) or "Thank you for your contribution 🚀!"
        }
        comment_response = requests.post(comment_url, headers=comment_headers, json=comment_body)

        print("Comment response:", comment_response.status_code)

    return JsonResponse({"status": "ok"})