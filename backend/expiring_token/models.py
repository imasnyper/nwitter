import datetime
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.db import models


class RefreshToken(Token):
    refresh_key = models.CharField(_("Refresh Key"), max_length=40)

    def do_refresh(self, refresh_key):
        if refresh_key == self.refresh_key:
            self.key = self.generate_key()
            self.refresh_key = self.generate_key()
            return self.save()

    def save(self, *args, **kwargs):
        if not self.refresh_key:
            self.refresh_key = self.generate_key()
        return super().save(*args, **kwargs)
        
