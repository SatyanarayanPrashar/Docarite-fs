import os
from dotenv import load_dotenv
import logging
import json
import uuid
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from pr_bot.models import Organisation, Repository
from pr_bot.serializers import OrganisationSerializer, RepositorySerializer
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

@csrf_exempt
@require_http_methods(["GET"])
def organisation_view(request):
    if request.method == 'GET':
        organisations = Organisation.objects.all().values('id', 'created_at', 'updated_at')
        return JsonResponse(list(organisations), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def organisation_create_view(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')

        if not name:
            return JsonResponse({'error': 'Name is required'}, status=400)

        org = Organisation.objects.create(name=name)
        serializer = OrganisationSerializer(org)
        return JsonResponse(serializer.data, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def organisation_detail_view(request, org_id):
    if request.method == 'GET':
        organisation = get_object_or_404(Organisation, id=org_id)
        serializer = OrganisationSerializer(organisation)
        return JsonResponse(serializer.data, status=200)
    
@csrf_exempt
@require_http_methods(["GET", "PUT"])
def repository_detail_view(request, repo_id):
    repo = get_object_or_404(Repository, id=repo_id)

    if request.method == 'GET':
        serializer = RepositorySerializer(repo)
        return JsonResponse(serializer.data, status=200)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            serializer = RepositorySerializer(repo, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            return JsonResponse(serializer.errors, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def repository_create_view(request):
    try:
        data = json.loads(request.body)

        # Ensure organisation exists
        org_id = data.get('organisation')
        if not Organisation.objects.filter(id=org_id).exists():
            return JsonResponse({'error': 'Invalid organisation ID'}, status=400)

        serializer = RepositorySerializer(data=data)
        if serializer.is_valid():
            repo = serializer.save()
            return JsonResponse(RepositorySerializer(repo).data, status=201)
        return JsonResponse(serializer.errors, status=400)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
