from django.db import models
from backend.models import User
# Create your models here.
class PromCouples(models.Model):
    COUPLE_STATUS = [
        (0, 'WAITING'),
        (1, 'ACCEPTED'),
        (2, 'DENIED'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="prom_couples_for")
    status = models.IntegerField(choices=COUPLE_STATUS , default=0)

    def __str__(self):
        return f"{self.user.name}->{self.to_user.name}"
    
    