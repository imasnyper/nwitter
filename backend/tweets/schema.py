import graphene
from graphql import GraphQLError
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphene_django.forms.mutation import DjangoModelFormMutation

from profiles.models import Profile
from tweets.models import Tweet
from tweets.forms import TweetForm


class TweetType(DjangoObjectType):
    class Meta:
        model = Tweet
        fields = "__all__"


class TweetMutation(graphene.Mutation):
    class Arguments:
        text = graphene.String(required=True)

    tweet = graphene.Field(TweetType)

    # @classmethod
    # def get_form(cls, root, info, **input):
    #     form_kwargs = cls.get_form_kwargs(root, info, **input)
    #     profile = Profile.objects.get(user__username=info.context.user.username)
    #     form_kwargs['profile'] = profile
    #     return cls._meta.form_class(**form_kwargs)

    # class Meta:
    #     form_class = TweetForm
    #     input_field_name = 'text'
    #     return_field_name = 'tweet'

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
    all_followed_tweets = graphene.List(TweetType)

    def resolve_all_tweets(root, info):
        return Tweet.objects.all()

    def resolve_profile_tweets(root, info, profile):
        try:
            return Tweet.objects.filter(profile__user__username=profile)
        except Tweet.DoesNotExist:
            return None

    def resolve_all_followed_tweets(root, info):
        print(info.context.user)
        if not info.context.user.is_authenticated:
            return None
        try:
            profile = Profile.objects.get(user__username=info.context.user.username)
            following = profile.following.all()
            return Tweet.objects.filter(Q(profile=profile) | Q(profile__in=following))
        except Tweet.DoesNotExist:
            return None


class Mutation(graphene.ObjectType):
    create_tweet = TweetMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
