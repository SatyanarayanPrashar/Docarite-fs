# views.py
from django.http import JsonResponse
from django.shortcuts import redirect

def install_callback(request):
    installation_id = request.GET.get("installation_id")
    setup_action = request.GET.get("setup_action")  # 'install' or 'update'

    # Save this installation ID to DB or link to the logged-in user
    print(f"Installation complete with ID: {installation_id}, action: {setup_action}")

    return redirect(f"http://localhost:3000/home/repositories?installation_id={installation_id}")
