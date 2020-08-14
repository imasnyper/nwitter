from django.contrib.auth.models import User
from django.db.models import Q
import graphene
from graphene_django import DjangoObjectType

from tweets.models import Tweet
from profiles.models import Profile


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = "__all__"

class TweetType(DjangoObjectType):
    class Meta:
        model = Tweet
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
    all_tweets = graphene.List(TweetType)
    all_users = graphene.List(UserType)
    all_profiles = graphene.List(ProfileType)
    profile_tweets = graphene.List(TweetType, profile=graphene.String(required=True))
    all_followed_tweets = graphene.List(TweetType, profile=graphene.String(required=True))

    def resolve_all_tweets(root, info):
        return Tweet.objects.all()

    def resolve_all_users(root, info):
        return User.objects.all()

    def resolve_all_profiles(root, info):
        return Profile.objects.all()

    def resolve_profile_tweets(root, info, profile):
        try:
            return Tweet.objects.filter(profile__user__username=profile)
        except Tweet.DoesNotExist:
            return None

    def resolve_all_followed_tweets(root, info, profile):
        try:
            profile = Profile.objects.get(user__username=profile)
            following = profile.following.all()
            return Tweet.objects.filter(Q(profile=profile) | Q(profile__in=following))
        except Tweet.DoesNotExist:
            return None

schema = graphene.Schema(query=Query)