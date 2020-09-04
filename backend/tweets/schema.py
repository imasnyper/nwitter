from itertools import chain

import graphene
from graphql import GraphQLError
from django.db.models import Q
from django.shortcuts import get_object_or_404
from graphene_django import DjangoObjectType
from graphene_django.forms.mutation import DjangoModelFormMutation

from profiles.models import Profile
from tweets.models import Tweet, Like, Retweet
from tweets.forms import TweetForm


class LikeType(DjangoObjectType):
    class Meta:
        model = Like
        fields = "__all__"


class RetweetType(DjangoObjectType):
    likes = graphene.List(LikeType)

    class Meta:
        model = Retweet
        fields = "__all__"

    def resolve_likes(self, info):
        likes = Like.objects.filter(tweet=self)
        return likes

class TweetType(DjangoObjectType):
    likes = graphene.List(LikeType)
    retweets = graphene.List(RetweetType)

    class Meta:
        model = Tweet
        fields = "__all__"

    def resolve_likes(self, info):
        likes = Like.objects.filter(tweet=self)
        return likes

    def resolve_retweets(self, info):
        retweets = Retweet.objects.filter(tweet=self)
        return retweets


class TweetLikeMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
    
    tweet = graphene.Field(TweetType)

    def mutate(self, info, id):
        tweet = get_object_or_404(Tweet, pk=id)
        profile = Profile.objects.get(user__username=info.context.user.username)
        like = Like.objects.create(profile=profile, tweet=tweet)

        return TweetLikeMutation(tweet=tweet)


class TweetRetweetMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        text = graphene.String(required=False)

    tweet = graphene.Field(TweetType)

    def mutate(self, info, id, text=""):
        tweet = get_object_or_404(Tweet, id=id)
        profile = Profile.objects.get(user__username=info.context.user.username)
        retweet = Retweet.objects.create(profile=profile, text=text, tweet=tweet)

        return TweetRetweetMutation(tweet=tweet)



class TweetMutation(graphene.Mutation):
    class Arguments:
        text = graphene.String(required=True)

    tweet = graphene.Field(TweetType)

    def mutate(self, info, text):
        if len(text) > 280:
            raise GraphQLError("Your tweet cannot be longer than 280 characters.")
        if len(text) < 1:
            raise GraphQLError("Your tweet must contain text.")
        profile = Profile.objects.get(user__username=info.context.user.username)
        tweet = Tweet.objects.create(profile=profile, text=text)

        return TweetMutation(tweet=tweet)

class Query(graphene.ObjectType):
    all_tweets = graphene.List(TweetType)
    profile_tweets = graphene.List(TweetType, profile=graphene.String(required=True))
    get_tweet = graphene.Field(TweetType, id=graphene.Int(required=True))
    all_followed_tweets = graphene.List(TweetType, first=graphene.Int(), after=graphene.Int())
    all_followed_retweets = graphene.List(RetweetType, first=graphene.Int(), after=graphene.Int())

    def resolve_all_tweets(root, info):
        return Tweet.objects.all().order_by("-created")

    def resolve_profile_tweets(root, info, profile):
        try:
            return Tweet.objects.filter(profile__user__username=profile).order_by("-created")
        except Tweet.DoesNotExist:
            return None

    def resolve_all_followed_tweets(root, info, first=10, after=0):
        if not info.context.user.is_authenticated:
            return None
        try:
            profile = Profile.objects.get(user__username=info.context.user.username)
            following = profile.following.all()
            return Tweet.objects.filter(Q(profile=profile) | Q(profile__in=following)).order_by("-created")[after:after+first]
        except Tweet.DoesNotExist:
            return None

    def resolve_all_followed_retweets(root, info, first=10, after=0):
        if not info.context.user.is_authenticated:
            return None
        try:
            profile = Profile.objects.get(user__username=info.context.user.username)
            following = profile.following.all()
            return Retweet.objects.filter(Q(profile=profile) | Q(profile__in=following)).order_by("-created")[after:after+first]
        except Retweet.DoesNotExist:
            return None

    def resolve_get_tweet(root, info, id):
        tweet = Tweet.objects.get(id=id)

        return tweet


class Mutation(graphene.ObjectType):
    create_tweet = TweetMutation.Field()
    like_tweet = TweetLikeMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
