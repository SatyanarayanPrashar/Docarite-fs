from django.urls import path
from .views import *

urlpatterns = [
    path("github/install/callback/", install_callback, name="install_callback"),
    path("github/webhook/", github_webhook),
]