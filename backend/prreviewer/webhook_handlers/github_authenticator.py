import hashlib
import hmac
import json
import time
import jwt
import requests
import logging

logger = logging.getLogger(__name__)

class GitHubAuthenticator:
    def __init__(self, app_id, private_key):
        self.app_id = app_id
        self.private_key = private_key

    def create_jwt(self):
        now = int(time.time())
        payload = {
            "iat": now,
            "exp": now + 540,
            "iss": self.app_id
        }
        try:
            return jwt.encode(payload, self.private_key, algorithm="RS256")
        except Exception as e:
            logger.error(f"JWT encoding failed: {e}")
            return None

    def get_installation_token(self, jwt_token, installation_id):
        headers = {
            "Authorization": f"Bearer {jwt_token}",
            "Accept": "application/vnd.github+json"
        }
        try:
            url = f"https://api.github.com/app/installations/{installation_id}/access_tokens"
            res = requests.post(url, headers=headers)
            res.raise_for_status()
            return res.json().get("token")
        except Exception as e:
            logger.error(f"Failed to get access token: {e}")
            return None


class SignatureValidator:
    def __init__(self, request, secret: bytes):
        self.request = request
        self.secret = secret

    def is_valid(self):
        signature = self.request.headers.get('X-Hub-Signature-256')
        if not signature:
            logger.warning("Request rejected: Signature missing")
            return False
        try:
            computed_sig = 'sha256=' + hmac.new(self.secret, self.request.body, hashlib.sha256).hexdigest()
            if not hmac.compare_digest(signature, computed_sig):
                logger.warning("Request rejected: Signature mismatch")
                return False
        except Exception as e:
            logger.error(f"Error validating signature: {e}")
            return False
        return True


class EventParser:
    def __init__(self, request):
        self.request = request

    def parse(self):
        try:
            event = self.request.headers.get("X-GitHub-Event", "")
            payload = json.loads(self.request.body)
            return event, payload
        except Exception as e:
            logger.error(f"Error parsing payload: {e}")
            return None, None