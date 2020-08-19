import datetime
from django.utils.timezone import utc
from rest_framework.authentication import TokenAuthentication
from rest_framework import exceptions
from django.conf import settings
from django.utils import timezone

from .models import RefreshToken

CLIENT_TOKEN_EXPIRY_TIME = settings.CLIENT_TOKEN_EXPIRY_TIME

class ExpiringTokenAuthentication(TokenAuthentication):
    """
    from here: https://bit.ly/2PV6MaI
    """
    model = RefreshToken
    def authenticate_credentials(self, key):
        try:
            token = self.get_model().objects.get(key=key)
        except self.get_model().DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid token')

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted')

        utc_now = timezone.now()

        if token.created < utc_now - datetime.timedelta(minutes=CLIENT_TOKEN_EXPIRY_TIME):
            raise exceptions.AuthenticationFailed('Token has expired')

        return (token.user, token)