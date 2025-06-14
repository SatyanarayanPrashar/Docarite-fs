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

load_dotenv()

APP_ID = os.getenv("GITHUB_APP_ID")
PRIVATE_KEY = os.getenv("GITHUB_PRIVATE_KEY")

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

    if event == "pull_request" and payload.get("action") == "opened":
        repo = payload["repository"]["full_name"]
        issue_number = payload["pull_request"]["number"]

        # Step 1: Create JWT
        now = int(time.time())
        payload_jwt = {
            "iat": now,
            "exp": now + 540,
            "iss": APP_ID
        }
        jwt_token = jwt.encode(payload_jwt, PRIVATE_KEY, algorithm="RS256")

        # Step 2: Get installation ID
        installation_id = payload["installation"]["id"]

        # Step 3: Get installation access token
        headers = {
            "Authorization": f"Bearer {jwt_token}",
            "Accept": "application/vnd.github+json"
        }
        res = requests.post(f"https://api.github.com/app/installations/{installation_id}/access_tokens", headers=headers)
        access_token = res.json()["token"]

        # Step 4: Post comment to the PR
        comment_url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/comments"
        comment_headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json"
        }
        comment_body = {
            "body": "Thank you for your contribution 🚀!"
        }
        comment_response = requests.post(comment_url, headers=comment_headers, json=comment_body)

        print("Comment response:", comment_response.status_code)

    return JsonResponse({"status": "ok"})