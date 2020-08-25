"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import json
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from graphene_django.views import GraphQLView
import rest_framework
from graphql_relay import to_global_id
# from rest_framework.authtoken import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes, api_view

from expiring_token.authentication import ExpiringTokenAuthentication
from expiring_token.views import ObtainExpiringAuthToken, RefreshExpiringAuthToken, login, logout, test

from profiles.models import Profile


class DRFAuthenticatedGraphQLView(GraphQLView):
    """
    see https://bit.ly/3242pQu,
    and https://github.com/graphql-python/graphene/issues/249
    """
    def parse_body(self, request):
        if isinstance(request, rest_framework.request.Request):
            return request.data
        return super(DRFAuthenticatedGraphQLView, self).parse_body(request)

    @classmethod
    def as_view(cls, *args, **kwargs):
        view = super(DRFAuthenticatedGraphQLView, cls).as_view(*args, **kwargs)
        view = permission_classes((IsAuthenticated,))(view)
        view = authentication_classes((ExpiringTokenAuthentication, ))(view)
        view = api_view(['GET', 'POST'])(view)
        return view

@api_view(['GET'])
@authentication_classes([ExpiringTokenAuthentication])
@permission_classes([IsAuthenticated])
def get_profile_uuid(request, username):
    profile_id = str(Profile.objects.get(user__username=username).id)
    uuid = to_global_id("ProfileType", profile_id)
    
    return HttpResponse(uuid)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    path('graphql-token/', csrf_exempt(DRFAuthenticatedGraphQLView.as_view())),
    path('api-token-auth/', ObtainExpiringAuthToken.as_view()),
    path('refresh-api-token/', RefreshExpiringAuthToken.as_view()),
    path('get-profile-uuid/<username>/', get_profile_uuid),
    path('login/', login),
    path('logout/', logout),
    path('test/', test),
]
