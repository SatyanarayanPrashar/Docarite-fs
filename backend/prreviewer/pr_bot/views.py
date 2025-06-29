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
from django.core.exceptions import ObjectDoesNotExist

load_dotenv()
logger = logging.getLogger(__name__)

GITHUB_INSTALLATION_REDIRECT_URL = os.getenv("GITHUB_INSTALLATION_REDIRECT_URL")

def install_callback(request):
    installation_id = request.GET.get("installation_id")
    setup_action = request.GET.get("setup_action")

    # Save this installation ID to DB or link to the logged-in user
    print(f"Installation complete with ID: {installation_id}, action: {setup_action}")

    return redirect(f"{GITHUB_INSTALLATION_REDIRECT_URL}?installation_id={installation_id}")


def get_preference(username, repo_name):
    """
    Fetch user preferences from the database based on email and repo name.
    """
    try:
        user = User.objects.get(username=username)
        repo = Repository.objects.get(
            name=repo_name,
            organisation__in=user.organisations.all()
        )
        return {
            "active": repo.active,
            "preferences": repo.preferences
        }
    except ObjectDoesNotExist:
        logger.error(f"User or repository not found for email: {username}, repo: {repo_name}")
        return None

@csrf_exempt
def github_webhook(request):
    print("Received GitHub webhook request", request)
    try:
        payload = json.loads(request.body)
        username = payload["pull_request"]["user"]["login"]
        repo_name = payload["repository"]["name"]
    except (KeyError, json.JSONDecodeError) as e:
        logger.error(f"Invalid or missing data in payload: {e}")
        return JsonResponse({"error": f"Invalid or missing data: {e}"}, status=400)

    repo_info = get_preference(username, repo_name)
    if not repo_info:
        logger.warning(f"No repo info found for {username} and {repo_name}")
        return JsonResponse({"error": "Repository not found or inaccessible"}, status=404)

    if repo_info.get("active") is False:
        return JsonResponse({"status": "Repository is inactive"}, status=200)

    handler = GitHubWebhookHandler(request, preference=repo_info.get("preferences"))
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
            username=user_name,
            email=user_email,
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
                "username": user.username,
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

@csrf_exempt
@require_http_methods(["POST"])
def sync_github_repositories(request):
    """
        In database list of repos available: A (inactive), B (active), C(active), D(active), E(active)
        Actually installed list of repos on github: A, B, E, F
        The differnce is C D . that means they were installed earlier but then removed.
        1. C and D should be marked with active = false.
        2. where as F should be added to the database.
        3. also notice that A was inactive so it will be made active.

        Hence, new database will be: A (active), B (active), C(inactive), D(inactive), E(active), F(active)
    """
    try:
        data = json.loads(request.body)
        logger.info("Received data for syncing GitHub repositories:", data)

        installed_repos = data.get("installed_repos", [])
        organisation_id = data.get("organisation_id")

        if not isinstance(installed_repos, list) or not organisation_id:
            logger.error("Invalid input: installed_repos must be a list and organisation_id is required")
            return JsonResponse({"error": "installed_repos must be a list and organisation_id is required"}, status=400)

        try:
            organisation = Organisation.objects.get(id=organisation_id)
            logger.info("Organisation found: %s", organisation)
        except Organisation.DoesNotExist:
            logger.error("Organisation not found with ID: %s", organisation_id)
            return JsonResponse({"error": "Organisation not found"}, status=404)

        # Step 1: Incoming GitHub URLs
        installed_repo_urls = set(repo["github_url"] for repo in installed_repos)
        logger.info("Installed repository URLs: %s", installed_repo_urls)

        # Step 2: All repos for this org in DB
        db_repos_qs = Repository.objects.filter(organisation=organisation)
        db_repos_map = {repo.github_url: repo for repo in db_repos_qs}
        db_repo_urls = set(db_repos_map.keys())
        logger.info("Database repository URLs: %s", db_repo_urls)

        to_create = []
        to_activate = []
        to_deactivate = db_repo_urls - installed_repo_urls
        logger.info("Repositories to deactivate: %s", to_deactivate)

        for repo in installed_repos:
            url = repo["github_url"]
            name = repo.get("name", "Unknown")
            installation_id = repo.get("installation_id", "NA")

            if url in db_repos_map:
                repo_obj = db_repos_map[url]
                if not repo_obj.active:
                    to_activate.append(url)
                    logger.info("Repository to activate: %s", url)
            else:
                to_create.append(Repository(
                    id=uuid.uuid4(),
                    github_url=url,
                    name=name,
                    installation_id=installation_id,
                    organisation=organisation,
                    active=True,
                    preferences={}
                ))
                logger.info("Repository to create: %s", url)

        # Step 3: Perform bulk operations
        Repository.objects.filter(github_url__in=to_deactivate, organisation=organisation).update(active=False)
        Repository.objects.filter(github_url__in=to_activate, organisation=organisation).update(active=True)
        Repository.objects.bulk_create(to_create)

        response = {
            "message": "Repository sync completed.",
            "deactivated": list(to_deactivate),
            "activated": to_activate,
            "created": [r.github_url for r in to_create]
        }
        logger.info("Repository sync response: %s", response)

        return JsonResponse(response)
    except Exception as e:
        logger.exception("Error during GitHub repository sync")
        return JsonResponse({"error": str(e)}, status=500)