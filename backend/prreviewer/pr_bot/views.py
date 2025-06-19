from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
import os
from dotenv import load_dotenv
import logging
from webhook_handlers.webhook_handler import GitHubWebhookHandler

load_dotenv()
from pathlib import Path

GITHUB_INSTALLATION_REDIRECT_URL = os.getenv("GITHUB_INSTALLATION_REDIRECT_URL")
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

    return redirect(f"{GITHUB_INSTALLATION_REDIRECT_URL}?installation_id={installation_id}")

logger = logging.getLogger(__name__)

@csrf_exempt
def github_webhook(request):
    handler = GitHubWebhookHandler(request)
    return handler.handle()
