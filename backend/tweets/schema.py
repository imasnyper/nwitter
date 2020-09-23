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


# class RetweetType(DjangoObjectType):
#     likes = graphene.List(LikeType)
#     retweets = graphene.List(lambda: RetweetType)

#     class Meta:
#         model = Retweet
#         fields = "__all__"

#     def resolve_likes(self, info):
#         return self.likes()

#     def resolve_retweets(self, info):
#         return self.retweets()


class TweetType(DjangoObjectType):
    likes = graphene.List(LikeType)
    retweet = graphene.Field(lambda: TweetType)
    retweets = graphene.Int()

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


# class TweetRetweetUnion(graphene.Union):
#     class Meta:
#         types = (TweetType, RetweetType)

#     @classmethod
#     def resolve_type(cls, instance, info):
#         if isinstance(instance, Tweet):
#             return TweetType
#         if isinstance(instance, Retweet):
#             return RetweetType
#         return TweetRetweetUnion.resolve_type(instance, info)


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
    profile_tweets = graphene.List(TweetType, profile=graphene.String(required=True), first=graphene.Int(), after=graphene.Int())
    # profile_retweets = graphene.List(RetweetType, profile=graphene.String(required=True), first=graphene.Int(), after=graphene.Int())
    get_tweet = graphene.Field(TweetType, id=graphene.Int(required=True))
    # get_retweet = graphene.Field(RetweetType, id=graphene.Int(required=True))
    
    all_followed_tweets = graphene.List(TweetType, first=graphene.Int(), after=graphene.Int())
    
    # all_followed_retweets = graphene.List(RetweetType, first=graphene.Int(), after=graphene.Int())
    # tweets_and_retweets = graphene.List(TweetRetweetUnion, first=graphene.Int(), after=graphene.Int())

    # def resolve_tweets_and_retweets(self, info, first=5, after=0):
    #     if not info.context.user.is_authenticated:
    #         return None
    #     profile = Profile.objects.get(user__username=info.context.user.username)
    #     following = profile.following.all()
    #     tweets = Tweet.objects.filter(Q(profile=profile) | Q(profile__in=following))[after:after+first]
    #     retweets = Retweet.objects.filter(Q(profile=profile) | Q(profile__in=following))[after:after+first]
    #     tweets_and_retweets = sorted(chain(tweets, retweets), key=attrgetter(created))


    def resolve_all_tweets(root, info):
        return Tweet.objects.all().order_by("-created")

    def resolve_profile_tweets(root, info, profile, first=5, after=0):
        try:
            return Tweet.objects.filter(profile__user__username=profile).order_by("-created")[after:after+first]
        except Tweet.DoesNotExist:
            return None

    # def resolve_profile_retweets(root, info, profile, first=5, after=0):
    #     try:
    #         return Retweet.objects.filter(profile__user__username=profile).order_by("-created")[after:after+first]
    #     except Retweet.DoesNotExist:
    #         return None

    def resolve_all_followed_tweets(root, info, first=5, after=0):
        if not info.context.user.is_authenticated:
            return None
        try:
            profile = Profile.objects.get(user__username=info.context.user.username)
            following = profile.following.all()
            return Tweet.objects.filter(Q(profile=profile) | Q(profile__in=following)).order_by("-created")[after:after+first]
        except Tweet.DoesNotExist:
            return None

    # def resolve_all_followed_retweets(root, info, first=5, after=0):
    #     if not info.context.user.is_authenticated:
    #         return None
    #     try:
    #         profile = Profile.objects.get(user__username=info.context.user.username)
    #         following = profile.following.all()
    #         return Retweet.objects.filter(Q(profile=profile) | Q(profile__in=following)).order_by("-created")[after:after+first]
    #     except Retweet.DoesNotExist:
    #         return None

    def resolve_get_tweet(root, info, id):
        tweet = Tweet.objects.get(id=id)

        return tweet

    # def resolve_get_retweet(root, info, id):
    #     retweet = Retweet.objects.get(id=id)

    #     return retweet


class Mutation(graphene.ObjectType):
    create_tweet = TweetMutation.Field()
    like_tweet = TweetLikeMutation.Field()
    retweet_tweet = TweetRetweetMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
