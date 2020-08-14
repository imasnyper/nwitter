from django.db import models
from profiles.models import Profile

# Create your models here.
class Tweet(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    text = models.CharField(max_length=280)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    likes = models.IntegerField(default=1, blank=True, null=True)

    def __str__(self):
        return f'{self.profile.user.username}: {self.text}'

    def __repr__(self):
        return f'{self.profile.user.username}: {self.text}'