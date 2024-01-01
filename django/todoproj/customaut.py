import logging
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.contrib.auth.models import User


logger = logging.getLogger(__name__)

class CustomJSONWebTokenAuthentication(JSONWebTokenAuthentication):
    def authenticate_credentials(self, payload):
        username = payload.get('preferred_username')
        logger.info(f"############Authenticating user with username: {username}")
        email = payload.get('email')
        first_name = payload.get('given_name')
        last_name = payload.get('family_name')
        logger.info(f"############Authenticating user with payload: {payload}")

        user, created = User.objects.get_or_create(username=username, defaults={'email': email, 'first_name': first_name, 'last_name': last_name})
        if created:
            logger.info(f"Created new user: {username}")
        else:
            # Update user details if they already exist
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.save()

        return user
