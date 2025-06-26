from django.db import models
from backend.models import User
# Create your models here.

class Slam(models.Model):
    SLAM_STATUS=[
        (0, "PENDING"),
        (1, "SENT"),
    ]
    status = models.BigIntegerField(choices=SLAM_STATUS ,default=0)
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="slams_for")
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="slams_from")
    first_impression = models.TextField(null=True, blank=True)
    describe_to_someone = models.TextField(null=True, blank=True)
    our_campus_spot = models.TextField(null=True, blank=True)
    relive_memory = models.TextField(null=True, blank=True)
    relive_day = models.TextField(null=True, blank=True)
    never_change = models.TextField(null=True, blank=True)
    last_day_plan = models.TextField(null=True, blank=True)
    best_advice = models.TextField(null=True, blank=True)
    never_forget = models.TextField(null=True, blank=True)
    reunion_plan = models.TextField(null=True, blank=True)
    my_life_in_ten = models.TextField(null=True, blank=True)
    final_farewell = models.TextField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['to_user', 'from_user'], name='unique_slam_pair')
        ]

    def __str__(self):
        to_user_name = self.to_user.name if self.to_user else "Unknown To"
        from_user_name = self.from_user.name if self.from_user else "Unknown From"
        return f"{from_user_name} → {to_user_name}"


