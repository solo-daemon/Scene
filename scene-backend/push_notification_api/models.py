from django.db import models
from backend.models import User
# Create your models here.

class PushSubscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="push_subscription")
    endpoint = models.TextField(unique=True)
    keys_auth = models.CharField(max_length=256)
    keys_p256dh = models.CharField(max_length=256)

    def __str__(self):
        return f"PushSubscription for {self.user.name}"