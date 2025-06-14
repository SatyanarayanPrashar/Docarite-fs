# views.py
from django.http import JsonResponse
from django.shortcuts import redirect
import hmac, hashlib, json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseForbidden

def install_callback(request):
    installation_id = request.GET.get("installation_id")
    setup_action = request.GET.get("setup_action")  # 'install' or 'update'

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
        pr = payload["pull_request"]
        print("🚀 PR opened:", pr["html_url"])  # trigger your logic here

    return JsonResponse({"status": "received"})
