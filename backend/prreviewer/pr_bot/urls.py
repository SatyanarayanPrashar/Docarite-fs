from django.urls import path
from .views import *

urlpatterns = [
    path("github/install/callback/", install_callback, name="install_callback"),
    path("github/webhook/", github_webhook),

    path('organisation/', organisation_view, name='organisation_list'),  # GET
    path('organisation/create/', organisation_create_view, name='organisation_create'),  # POST
    path('organisation/<uuid:org_id>/', organisation_detail_view, name='organisation_detail'),  # GET, PUT

    path('user/', user_view, name='user_list'),  # GET, POST
    path('user/by-email/', user_detail_view, name='user_detail'),  # GET, PUT

    path('repository/', repository_create_view, name='repository_create'),  # POST
    path('repository/<uuid:repo_id>/', repository_detail_view, name='repository_detail'),  # GET, PUT
    path('sync_repository/', sync_github_repositories, name='repository_sync'),  # GET, PUT

    path("user_register/", register_organisation_with_user, name="create_user_with_organisation"),  # POST
    path('user_org_repo/list/by-email/', user_orgs_repos_view, name='repository_list'),  # GET
]