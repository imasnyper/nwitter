from django.db import models
from django.core.validators import ValidationError
from profiles.models import Profile


class CommonFields(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    text = models.CharField(max_length=280)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def likes(self):
        if isinstance(self, Tweet):
            return Like.objects.filter(tweet=self)
        else:
            return Like.objects.filter(tweet=self.tweet)

    def retweets(self):
        if isinstance(self, Tweet):
            return Retweet.objects.filter(tweet=self)
        else:
            return Retweet.objects.filter(tweet=self.tweet)

    class Meta:
        abstract = True


class Tweet(CommonFields):
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Like.objects.get_or_create(profile=self.profile, tweet=self)

    def __str__(self):
        return f'{self.profile.user.username}: {self.text}'

    def __repr__(self):
        return f'{self.profile.user.username}: {self.text}'


class Like(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE)

    def clean(self):
        exists = Like.objects.filter(profile=self.profile, tweet=self.tweet)
        if exists:
            raise ValidationError({
                'profile': 'this profile has already liked this tweet.',
                'tweet': 'this tweet was already liked by this profile',
                })

        return super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Retweet(CommonFields):
    id = models.BigAutoField(primary_key=True)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name="retweets")

    def clean(self):
        exists = Retweet.objects.filter(profile=self.profile, tweet=self.tweet)
        if exists:
            raise ValidationError({
                'profile': 'this profile has already retweeted this tweet.',
                'tweet': 'this tweet was already retweeted by this profile',
                })

        return super().clean()

    def save(self, *args, **kwargs):
        # self.clean()
        super().save(*args, **kwargs)