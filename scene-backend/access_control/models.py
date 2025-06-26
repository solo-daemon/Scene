from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UserBlock(models.Model):
    blocked_user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='blocked_entry')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.blocked_user.name} is blocked"
