import graphene
from django.contrib.auth.models import User
from django_filters import FilterSet, OrderingFilter
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from profiles.models import Profile
from tweets.models import Tweet


class UserFilter(FilterSet):
    class Meta:
        model = User
        fields = "__all__"

    order_by = OrderingFilter(
        fields = (
            ('created', 'created'),
            ('username', 'username')
        )
    )


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = "__all__"
        interfaces = (graphene.relay.Node, )


class ProfileFilter(FilterSet):
    class Meta:
        model = Profile
        fields = "__all__"

    order_by = OrderingFilter(
        fields = (
            ('created', 'created'),
            ('user__username', 'username')
        )
    )


class ProfileType(DjangoObjectType):
    class Meta:
        model = Profile
        fields = "__all__"
        interfaces = (graphene.relay.Node, )
        filter_fields = ("user__username", )

    followers = DjangoFilterConnectionField(lambda: ProfileType)

    def resolve_followers(self, info):
        user = Profile.objects.get(user__username=self.user.username)
        return user.followers()

class Query(graphene.ObjectType):
    all_users = DjangoFilterConnectionField(
        UserType,
        filterset_class=UserFilter)
    all_profiles = DjangoFilterConnectionField(
        ProfileType,
        filterset_class=ProfileFilter)
    profile = graphene.relay.Node.Field(
        ProfileType,
        filterset_class=ProfileFilter)

    def resolve_all_users(root, info, order_by):
        return User.objects.all()

    def resolve_all_profiles(root, info, order_by):
        return Profile.objects.all()

    def resolve_profile(root, info, profile):
        profile = Profile.objects.get(user__username=profile)
        return profile

schema = graphene.Schema(query=Query)
