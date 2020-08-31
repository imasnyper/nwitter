from django.contrib.auth.forms import UserCreationForm
from django import forms


class ProfileCreationForm(UserCreationForm):
    email = forms.EmailField()

    def save(self):
        user = super().save()
        user.email = self.cleaned_data['email']
        user.save()
        return user