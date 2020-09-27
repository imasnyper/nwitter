from itertools import chain

import channels_graphql_ws
import graphene
from django.db.models import Q
from django.shortcuts import get_object_or_404
from graphene_django import DjangoObjectType
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphql import GraphQLError

from profiles.models import Profile
from tweets.forms import TweetForm
from tweets.models import Like, Tweet


class LikeType(DjangoObjectType):
    class Meta:
        model = Like
        fields = "__all__"


class TweetType(DjangoObjectType):
    likes = graphene.List(LikeType)
    retweet = graphene.Field(lambda: TweetType)
    retweets = graphene.Int()
    replies = graphene.List(lambda: TweetType)
    is_reply = graphene.Boolean()
    reply_to = graphene.Field(lambda: TweetType)

    class Meta:
        model = Tweet
        fields = "__all__"

    def resolve_likes(self, info):
        likes = Like.objects.filter(tweet=self)
        return likes

    def resolve_retweet(self, info):
        retweet = Tweet.objects.get(id=self.id).retweet
        return retweet

    def resolve_retweets(self, info):
        retweets = Tweet.objects.get(id=self.id).retweets.all().count()
        return retweets

    def resolve_replies(self, info):
        replies = Tweet.objects.get(id=self.id).replies.order_by("-created")
        return replies

    def resolve_is_reply(self, info):
        tweet = Tweet.objects.get(id=self.id)
        return tweet.is_reply()

    def resolve_reply_to(self, info):
        tweet = Tweet.objects.get(id=self.id)
        return tweet.reply_to


class TweetSubscription(channels_graphql_ws.Subscription):
    tweet = graphene.Field(TweetType)

    class Arguments:
        pass

    @staticmethod
    def subscribe(self, info):
        del info
        return super().subscribe()

    @staticmethod
    def publish(self, info):
        return TweetSubscription(event='something happened')

    


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
        retweet = Tweet.objects.create(profile=profile, text=text, retweet=tweet)

        return TweetRetweetMutation(tweet=retweet)


class TweetReplyMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        text = graphene.String(required=False)

    tweet = graphene.Field(TweetType)

    def mutate(self, info, id, text=""):
        tweet = get_object_or_404(Tweet, id=id)
        profile = Profile.objects.get(user__username=info.context.user.username)
        reply = Tweet.objects.create(profile=profile, text=text, reply_to=tweet)

        return TweetRetweetMutation(tweet=reply)


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
    all_tweets = graphene.List(TweetType, first=graphene.Int(), after=graphene.Int())
    profile_tweets = graphene.List(TweetType, profile=graphene.String(required=True), first=graphene.Int(), after=graphene.Int())
    get_tweet = graphene.Field(TweetType, id=graphene.Int(required=True))
    all_followed_tweets = graphene.List(TweetType, first=graphene.Int(), after=graphene.Int())

    def resolve_all_tweets(root, info, first=5, after=0):
        return Tweet.objects.all().order_by("-created")[after:after+first]

    def resolve_profile_tweets(root, info, profile, first=5, after=0):
        try:
            return Tweet.objects.filter(profile__user__username=profile).order_by("-created")[after:after+first]
        except Tweet.DoesNotExist:
            return None

    def resolve_all_followed_tweets(root, info, first=5, after=0):
        if not info.context.user.is_authenticated:
            return None
        try:
            profile = Profile.objects.get(user__username=info.context.user.username)
            following = profile.following.all()
            return Tweet.objects.filter(Q(profile=profile) | Q(profile__in=following)).order_by("-created")[after:after+first]
        except Tweet.DoesNotExist:
            return None

    def resolve_get_tweet(root, info, id):
        tweet = Tweet.objects.get(id=id)

        return tweet


class Mutation(graphene.ObjectType):
    create_tweet = TweetMutation.Field()
    like_tweet = TweetLikeMutation.Field()
    retweet_tweet = TweetRetweetMutation.Field()
    reply_tweet = TweetReplyMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
