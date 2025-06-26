import os
from dotenv import load_dotenv
import logging
import json
import uuid
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from pr_bot.models import Organisation, Permission, Repository, User
from pr_bot.serializers import OrganisationBasicSerializer, OrganisationSerializer, RepositorySerializer, RepositorySummarySerializer, UserOrgInfoSerializer, UserSerializer
from webhook_handlers.webhook_handler import GitHubWebhookHandler

load_dotenv()
logger = logging.getLogger(__name__)

GITHUB_INSTALLATION_REDIRECT_URL = os.getenv("GITHUB_INSTALLATION_REDIRECT_URL")

def install_callback(request):
    installation_id = request.GET.get("installation_id")
    setup_action = request.GET.get("setup_action")

    # Save this installation ID to DB or link to the logged-in user
    print(f"Installation complete with ID: {installation_id}, action: {setup_action}")

    return redirect(f"{GITHUB_INSTALLATION_REDIRECT_URL}?installation_id={installation_id}")


@csrf_exempt
def github_webhook(request):
    handler = GitHubWebhookHandler(request)
    return handler.handle()


# Organisation Views
@csrf_exempt
@require_http_methods(["GET"])
def organisation_view(request):
    organisations = Organisation.objects.all()
    serializer = OrganisationSerializer(organisations, many=True)
    return JsonResponse(serializer.data, safe=False, status=200)

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
        logger.exception("Error while creating organisation")
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def organisation_detail_view(request, org_id):
    organisation = get_object_or_404(Organisation, id=org_id)
    serializer = OrganisationSerializer(organisation)
    return JsonResponse(serializer.data, status=200)


# User Views
@csrf_exempt
@require_http_methods(["GET", "POST"])
def user_view(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                user = serializer.save()
                return JsonResponse(serializer.data, status=201)
            return JsonResponse({'message': 'User creation not implemented'}, status=501)
        except Exception as e:
            logger.exception("Error while creating user")
            return JsonResponse({'error': str(e)}, status=400)
        
@csrf_exempt
@require_http_methods(["GET", "PUT"])
def user_detail_view(request):
    email = request.GET.get('email')
    if not email:
        return JsonResponse({'error': 'email query parameter is required'}, status=400)

    user = get_object_or_404(User, email=email)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data, status=200)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            serializer = UserSerializer(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=200)
            return JsonResponse(serializer.errors, status=400)
        except Exception as e:
            logger.exception("Error while updating user")
            return JsonResponse({'error': str(e)}, status=400)


# Repository Views
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
            logger.exception("Error while updating repository")
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def repository_create_view(request):
    try:
        data = json.loads(request.body)

        # Ensure we received a list
        if not isinstance(data, list):
            return JsonResponse({'error': 'Expected a list of repositories'}, status=400)

        created_repos = []
        errors = []

        for index, repo_data in enumerate(data):
            org_id = repo_data.get('organisation')
            if not Organisation.objects.filter(id=org_id).exists():
                errors.append({'index': index, 'error': f'Invalid organisation ID: {org_id}'})
                continue

            serializer = RepositorySerializer(data=repo_data)
            if serializer.is_valid():
                repo = serializer.save()
                created_repos.append(RepositorySerializer(repo).data)
            else:
                errors.append({'index': index, 'error': serializer.errors})

        return JsonResponse({
            'created': created_repos,
            'errors': errors
        }, status=207 if errors else 201)

    except Exception as e:
        logger.exception("Error while creating repositories")
        return JsonResponse({'error': str(e)}, status=400)


## Frontend use
@csrf_exempt
@require_http_methods(["GET"])
def user_orgs_repos_view(request):
    email = request.GET.get('email')
    if not email:
        return JsonResponse({'error': 'email parameter is required'}, status=400)

    try:
        user = User.objects.prefetch_related(
            'organisation_permissions__organisation__repositories'
        ).get(email=email)
    except User.DoesNotExist:
        return JsonResponse({'state': 'user not found'}, status=404)

    # Serialize user + org-permission info
    user_data = UserOrgInfoSerializer(user).data

    # Serialize all orgs
    orgs = user.organisations.all()
    orgs_data = OrganisationBasicSerializer(orgs, many=True).data

    # Serialize first org's repos
    first_org_repos = []
    if orgs:
        first_org = orgs[0]
        first_org_repos = RepositorySummarySerializer(first_org.repositories.all(), many=True).data

    return JsonResponse({
        'user': user_data,
        'organisations': orgs_data,
        'repositories': first_org_repos
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def register_organisation_with_user(request):
    try:
        data = json.loads(request.body)

        org_name = data.get("org_name")
        org_email = data.get("org_email")
        org_website = data.get("org_website")
        user_name = data.get("user_name")
        user_email = data.get("user_email")

        if not all([org_name, user_name, user_email]):
            return JsonResponse({"error": "Missing required fields"}, status=400)

        # Prevent duplicates
        if org_email and Organisation.objects.filter(email=org_email).exists():
            return JsonResponse({"error": "Organisation with this email already exists"}, status=400)
        if User.objects.filter(email=user_email).exists():
            return JsonResponse({"error": "User with this email already exists"}, status=400)

        # Step 1: Create Organisation
        organisation = Organisation.objects.create(
            name=org_name,
            email=org_email,
            website=org_website
        )

        # Step 2: Create User
        user = User.objects.create(
            name=user_name,
            email=user_email
        )

        # Step 3: Link via Permission
        Permission.objects.create(
            user=user,
            organisation=organisation,
            role="admin",
            permissions={"can_invite": True, "can_edit": True, "can_delete": True}
        )

        return JsonResponse({
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email
            },
            "organisation": {
                "id": str(organisation.id),
                "name": organisation.name,
                "email": organisation.email,
                "website": organisation.website
            },
            "role": "admin"
        }, status=201)

    except Exception as e:
        logger.exception("Error during org + user registration")
        return JsonResponse({"error": str(e)}, status=400)
