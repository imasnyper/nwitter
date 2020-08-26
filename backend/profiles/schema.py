import graphene
from django.contrib.auth.models import User
from graphene_django import DjangoObjectType

from profiles.models import Profile
from tweets.models import Tweet


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = "__all__"


class ProfileType(DjangoObjectType):
    class Meta:
        model = Profile
        fields = "__all__"

    followers = graphene.List(lambda: ProfileType)

    def resolve_followers(self, info):
        user = Profile.objects.get(user__username=self.user.username)
        return user.followers()

class Query(graphene.ObjectType):
    all_users = graphene.List(UserType)
    all_profiles = graphene.List(ProfileType)
    profile = graphene.Field(ProfileType, profile=graphene.String(required=True))

    def resolve_all_users(root, info):
        return User.objects.all()

    def resolve_all_profiles(root, info):
        return Profile.objects.all()

    def resolve_profile(root, info, profile):
        profile = Profile.objects.get(user__username=profile)
        return profile

schema = graphene.Schema(query=Query)
