from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers

from .models import RefreshToken


class RefreshTokenSerializer(serializers.Serializer):
    username = serializers.CharField(label=_("Username"))
    refresh_token = serializers.CharField(label=_("Refresh Token"))

    def validate(self, attrs):
        username = attrs.get('username')
        refresh_token = attrs.get('refresh_token')

        if username and refresh_token:
            user = User.objects.get(username=username)
            token = RefreshToken.objects.get(refresh_key=refresh_token)

            if token.user != user:
                msg = _('Unable to log in with provided credentials')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "username" and "refresh_token".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['username'] = username
        return attrs
