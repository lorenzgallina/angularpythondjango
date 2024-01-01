import logging
from django.contrib.auth.models import User
from django.conf import settings

logger = logging.getLogger(__name__)


class KeycloakBackend:
    """
    Custom authentication backend to create user if not exists.
    """

    def authenticate(self, request, username=None, email=None):
        logger.error(f"###################{request}")
        if not username:
            return None

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            # Create a new user. No password is set since authentication is handled by Keycloak.
            user = User(username=username, email=email, is_active=True)
            user.save()

        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
