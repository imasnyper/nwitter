import datetime
from django.utils.timezone import utc
from django.utils import timezone
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.http import HttpResponse
import json
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render

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
            token, created = Token.objects.get_or_create(user=user)

            utc_now = timezone.now()

            if not created and token.created < utc_now - datetime.timedelta(minutes=CLIENT_TOKEN_EXPIRY_TIME):
                token.delete()
                token = Token.objects.create(user=user)
                token.created = datetime.datetime.utcnow()
                token.save()

            response_data = {'token': token.key}
            return HttpResponse(json.dumps(response_data), content_type="application/json")

        return HttpResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def test(request):
    return render(request, "test.html")

def login(request):
    username = request.POST.get('username', "")
    password = request.POST.get('password', "")
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)

    return HttpResponse(status=status.HTTP_200_OK)


def logout(request):
    logout(request)

    return HttpResponse(status=status.HTTP_200_OK)