from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=280, null=True)
    location = models.TextField(max_length=30, null=True)
    website = models.URLField(max_length=100, null=True)
    birthday = models.DateField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    following = models.ManyToManyField('self', symmetrical=False)

    def followers(self):
        return Profile.objects.filter(following__user__username=self.user.username)

    def __str__(self):
        return self.user.username

    def __repr__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user(sender, instance, **kwargs):
    instance.profile.save()
