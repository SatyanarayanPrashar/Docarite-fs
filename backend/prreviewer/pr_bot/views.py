from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
import os
from dotenv import load_dotenv
import logging
from webhook_handlers.webhook_handler import GitHubWebhookHandler

load_dotenv()

GITHUB_INSTALLATION_REDIRECT_URL = os.getenv("GITHUB_INSTALLATION_REDIRECT_URL")

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
