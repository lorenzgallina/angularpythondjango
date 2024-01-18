import logging
from django.contrib.auth.models import User
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class EnsureUserExistsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        logger.info(f"########Authenticating user with username: {request}")

        if request.user and not request.user.is_anonymous:
            User.objects.get_or_create(username=request.user.username)