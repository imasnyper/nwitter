import graphene
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
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
        profile = Profile.objects.get(user__username=self.user.username)
        return profile.followers()


class FollowProfileMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
    
    profile = graphene.Field(ProfileType)

    def mutate(self, info, id):
        profile_to_follow = get_object_or_404(Profile, pk=id)
        profile = Profile.objects.get(user__username=info.context.user.username)
        profile.following.add(profile_to_follow)

        return FollowProfileMutation(profile=profile)


class EditBioMutation(graphene.Mutation):
    class Arguments:
        bio = graphene.String(required=True)
    
    profile = graphene.Field(ProfileType)

    def mutate(self, info, bio):
        profile = Profile.objects.get(user__username=info.context.user.username)
        profile.bio = bio
        profile.save()

        return EditBioMutation(profile=profile)


class EditLocationMutation(graphene.Mutation):
    class Arguments:
        location = graphene.String(required=True)
    
    profile = graphene.Field(ProfileType)

    def mutate(self, info, location):
        profile = Profile.objects.get(user__username=info.context.user.username)
        profile.location = location
        profile.save()

        return EditLocationMutation(profile=profile)


class EditWebsiteMutation(graphene.Mutation):
    class Arguments:
        website = graphene.String(required=True)
    
    profile = graphene.Field(ProfileType)

    def mutate(self, info, website):
        profile = Profile.objects.get(user__username=info.context.user.username)
        profile.website = website
        profile.save()

        return EditWebsiteMutation(profile=profile)

class EditBirthdayMutation(graphene.Mutation):
    class Arguments:
        birthday = graphene.Date(required=True)
    
    profile = graphene.Field(ProfileType)

    def mutate(self, info, birthday):
        profile = Profile.objects.get(user__username=info.context.user.username)
        profile.birthday = birthday
        profile.save()

        return EditBirthdayMutation(profile=profile)

class EditProfileMutation(graphene.Mutation):
    class Arguments:
        bio = graphene.String()
        location = graphene.String()
        website = graphene.String()
        birthday = graphene.Date()

    profile = graphene.Field(ProfileType)

    def mutate(self, info, bio="", location="", website="", birthday=""):
        profile = Profile.objects.get(user__username=info.context.user.username)
        if bio:
            profile.bio = bio
        if location:
            profile.location = location
        if website:
            profile.website = website
        if birthday:
            profile.birthday = birthday
        profile.save()

        return EditProfileMutation(profile=profile)

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


class Mutation(graphene.ObjectType):
    follow_profile = FollowProfileMutation.Field()
    edit_bio = EditBioMutation.Field()
    edit_location = EditLocationMutation.Field()
    edit_website = EditWebsiteMutation.Field()
    edit_birthday = EditBirthdayMutation.Field()
    edit_profile = EditProfileMutation.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
