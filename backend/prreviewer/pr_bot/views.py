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
import logging
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

logger = logging.getLogger(__name__)

@csrf_exempt
def github_webhook(request):
    secret = b'mysecret123'
    signature = request.headers.get('X-Hub-Signature-256')

    if not signature:
        logger.warning("Request rejected: Signature missing")
        return HttpResponseForbidden("Signature missing")

    try:
        computed_sig = 'sha256=' + hmac.new(secret, request.body, hashlib.sha256).hexdigest()
    except Exception as e:
        logger.error(f"Error computing signature: {e}")
        return HttpResponseForbidden("Error validating signature")

    if not hmac.compare_digest(signature, computed_sig):
        logger.warning("Request rejected: Signature mismatch")
        return HttpResponseForbidden("Signature mismatch")

    try:
        event = request.headers.get("X-GitHub-Event", "")
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        logger.error("Invalid JSON payload")
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)
    except Exception as e:
        logger.error(f"Error reading payload: {e}")
        return JsonResponse({"error": "Error reading payload"}, status=400)

    if event == "pull_request" and payload.get("action") in ["opened", "reopened"]:
        try:
            repo = payload["repository"]["full_name"]
            issue_number = payload["pull_request"]["number"]
            installation_id = payload["installation"]["id"]
        except KeyError as e:
            logger.error(f"Missing key in payload: {e}")
            return JsonResponse({"error": f"Missing key {e} in payload"}, status=400)

        now = int(time.time())
        payload_jwt = {
            "iat": now,
            "exp": now + 540,
            "iss": APP_ID
        }

        try:
            jwt_token = jwt.encode(payload_jwt, PRIVATE_KEY, algorithm="RS256")
        except Exception as e:
            logger.error(f"JWT encoding failed: {e}")
            return JsonResponse({"error": "JWT encoding failed"}, status=500)

        headers = {
            "Authorization": f"Bearer {jwt_token}",
            "Accept": "application/vnd.github+json"
        }

        try:
            res = requests.post(f"https://api.github.com/app/installations/{installation_id}/access_tokens", headers=headers)
            res.raise_for_status()
            access_token = res.json().get("token")
            if not access_token:
                logger.error("Access token not found in response")
                return JsonResponse({"error": "Access token missing"}, status=500)
        except requests.RequestException as e:
            logger.error(f"Failed to get access token: {e}")
            return JsonResponse({"error": "Failed to get access token"}, status=502)
        except json.JSONDecodeError:
            logger.error("Invalid JSON response when fetching access token")
            return JsonResponse({"error": "Invalid JSON response"}, status=502)

        comment_url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/comments"
        comment_headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github+json"
        }

        try:
            comment_text = analyse_pr(payload, access_token) or "Thank you for your contribution 🚀!"
        except Exception as e:
            logger.error(f"Error analysing PR: {e}")
            comment_text = "Thank you for your contribution 🚀!"

        comment_body = {"body": comment_text}

        try:
            comment_response = requests.post(comment_url, headers=comment_headers, json=comment_body)
            comment_response.raise_for_status()
            logger.info(f"Comment posted successfully, status code {comment_response.status_code}")
        except requests.RequestException as e:
            logger.error(f"Failed to post comment: {e}")
            return JsonResponse({"error": "Failed to post comment"}, status=502)

    return JsonResponse({"status": "ok"})
