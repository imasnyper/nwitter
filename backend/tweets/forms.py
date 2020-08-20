from django import forms

from .models import Tweet
from profiles.models import Profile

class TweetForm(forms.ModelForm):
    profile = forms.ModelChoiceField(queryset=Profile.objects.all(), required=False)
    class Meta:
        model = Tweet
        fields = ('text', 'profile')