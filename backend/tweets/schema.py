import graphene
from graphql import GraphQLError
from graphql_relay import from_global_id
from django.db.models import Q
from django_filters import FilterSet, OrderingFilter
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.forms.mutation import DjangoModelFormMutation

from profiles.models import Profile
from tweets.models import Tweet
from tweets.forms import TweetForm


class TweetFilter(FilterSet):
    class Meta:
        model = Tweet
        fields = "__all__"

    order_by = OrderingFilter(
        fields = (
            ('created', 'created'),
        )
    )


class TweetType(DjangoObjectType):
    class Meta:
        model = Tweet
        fields = "__all__"
        interfaces = (graphene.relay.Node, )


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
    all_tweets = DjangoFilterConnectionField(
        TweetType, 
        filterset_class=TweetFilter, 
        order_by=graphene.String(required=False))
    profile_tweets = DjangoFilterConnectionField(
        TweetType,
        filterset_class=TweetFilter, 
        # profile=graphene.String(required=True),
        order_by=graphene.String(required=False))
    all_followed_tweets = DjangoFilterConnectionField(
        TweetType,
        filterset_class=TweetFilter,
        order_by=graphene.String(required=False))

    def resolve_all_tweets(root, info, order_by):
        return Tweet.objects.all()

    def resolve_profile_tweets(root, info, profile, order_by):
        try:
            return Tweet.objects.filter(profile__pk=from_global_id(profile)[1])
            # return Tweet.objects.filter(profile__user__username=profile)
        except Tweet.DoesNotExist:
            return None

    def resolve_all_followed_tweets(root, info, order_by):
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
