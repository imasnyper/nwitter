import datetime
from django.utils.timezone import utc, is_aware
from django.utils import timezone
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework import status, parsers, renderers
from rest_framework.views import APIView
from rest_framework.compat import coreapi, coreschema
from django.http import HttpResponse
import json
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render

from .models import RefreshToken
from .serializers import RefreshTokenSerializer

CLIENT_TOKEN_EXPIRY_TIME = settings.CLIENT_TOKEN_EXPIRY_TIME

# Create your views here.
class ObtainExpiringAuthToken(ObtainAuthToken):
    """
    from here: https://bit.ly/2PV6MaI
    """
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(username=serializer.validated_data['username'])
            token, created = RefreshToken.objects.get_or_create(user=user)

            utc_now = timezone.now()

            five_minutes_until_expiry = token.created + datetime.timedelta(minutes=CLIENT_TOKEN_EXPIRY_TIME - 5)

            if not created and (utc_now - five_minutes_until_expiry).seconds < (5 * 60):
                token.delete()
                token = RefreshToken.objects.create(user=user)
                token.created = utc_now
                token.save()

            token_expiry_time = (token.created + datetime.timedelta(
                minutes=CLIENT_TOKEN_EXPIRY_TIME)).timestamp()

            response_data = {'token': token.key, 'refresh_token': token.refresh_key, 'username': user.username, 'tokenExpiryTime': token_expiry_time}
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        return HttpResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RefreshExpiringAuthToken(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = RefreshTokenSerializer
    if coreapi is not None and coreschema is not None:
        schema = ManualSchema(
            fields=[
                coreapi.Field(
                    name="username",
                    required=True,
                    location='form',
                    schema=coreschema.String(
                        title="Username",
                        description="Valid username",
                    ),
                ),
                coreapi.Field(
                    name="refresh_token",
                    required=True,
                    location='form',
                    schema=coreschema.String(
                        title="Refresh Token",
                        description="Valid refresh token matching username to get new token",
                    ),
                ),
            ],
            encoding="application/json",
        )

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(username=serializer.validated_data['username'])
        token = RefreshToken.objects.get(user=user, refresh_key=serializer.validated_data['refresh_token'])
        token.delete()
        token = RefreshToken.objects.create(user=user)

        token_expiry_time = (token.created + datetime.timedelta(
            minutes=CLIENT_TOKEN_EXPIRY_TIME)).timestamp()

        response_data = {'token': token.key, 'refresh_token': token.refresh_key, 'username': user.username, 'tokenExpiryTime': token_expiry_time}
        return HttpResponse(json.dumps(response_data), content_type="application/json")