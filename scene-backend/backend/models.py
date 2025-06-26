from django.db import models
from django.db.models import F
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from datetime import timedelta

class College(models.Model):
    college_name = models.CharField(max_length=255, unique=True, db_index=True)
    abbreviation = models.TextField(default="none")
    college_slug = models.CharField(max_length=255)
    def __str__(self):
        return self.college_name

    class Meta:
        ordering = ['college_name']  # Optimized ordering for queries
        indexes = [
            models.Index(fields=['college_name']),  # Speeds up lookups
        ]

class Identity(models.Model):
    identity_name = models.CharField(max_length=255, unique=True, db_index=True)

    def __str__(self):
        return self.identity_name
    
    class Meta:
        ordering = ['identity_name']  # Optimized ordering for queries
        indexes = [
            models.Index(fields=['identity_name']),  # Speeds up lookups
        ]

class TravelType(models.Model):
    travel_type = models.CharField(max_length=255, unique=True, db_index=True)
    description = models.TextField(default="none")
    def __str__(self):
        return self.travel_type
    
    class Meta:
        ordering = ['travel_type']  # Optimized ordering for queries
        indexes = [
            models.Index(fields=['travel_type']),  # Speeds up lookups
        ]

class Branch(models.Model):
    branch_name = models.CharField(max_length=255, unique=True, db_index=True)
    branch_slug = models.CharField(max_length=255, unique=True)
    def __str__(self):
        return self.branch_slug

class Nostalgia(models.Model):
    nostalgia_name = models.CharField(max_length=255, unique=True)
    def __str__(self):
        return self.nostalgia_name

class CustomUserManager(BaseUserManager):
    def create_user(self, gmail, google_id, name, password=None):
        if not gmail:
            raise ValueError("Users must have a Gmail address")

        user = self.model(
            gmail=self.normalize_email(gmail),
            google_id=google_id,
            name=name,
        )
        user.set_password(password)  # Password is required by Django Auth system
        user.save(using=self._db)
        return user

    def create_superuser(self, gmail, google_id, name, password=None):
        user = self.create_user(gmail, google_id, name, password)
        user.is_admin = True
        user.save(using=self._db)
        return user

class SceneFrequency(models.Model):
    scene_frequency_name = models.CharField(max_length=255, unique=True, db_index=True)

    def __str__(self):
        return self.scene_frequency_name
    
    class Meta:
        ordering = ['scene_frequency_name']
        indexes = [
            models.Index(fields=['scene_frequency_name']), 
        ]

class WhoIsAround(models.Model):
    who_is_around_name = models.CharField(max_length=255, unique=True, db_index=True)

    def __str__(self):
        return self.who_is_around_name
    
    class Meta:
        ordering = ['who_is_around_name']
        indexes = [
            models.Index(fields=['who_is_around_name']), 
        ]

def default_expiry():
    return timezone.now() + timedelta(days=90)

class MagicUser(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="magic_links")
    code = models.CharField(max_length=255, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expiry)

    def is_valid(self):
        return self.expires_at > timezone.now()
    
    def __str__(self):
        return self.user.name

class User(AbstractBaseUser):
    id = models.BigAutoField(primary_key=True)
    last_login = models.DateTimeField(null=True, blank=True, default=timezone.now)
    year = models.IntegerField(
        null=True,
        validators=[
            MinValueValidator(1900),  # Ensures the year is at least 1900
            MaxValueValidator(2100),  # Ensures the year does not exceed 2100
        ]
    )
    USER_TYPES = [
    (0, "NORMAL"),
    (1, "RESTAURANT"),
    ]
    GENDER_PREFERENCE = [
    (0, "MEN"),
    (1, "WOMEN"),
    (2, "BOTH"),
    ]
    user_type = models.IntegerField(choices=USER_TYPES, default=0)
    status_text= models.CharField(max_length=40, null=True, blank=True)
    branch = models.ForeignKey("Branch", on_delete=models.SET_NULL, null=True, blank=True)
    gmail = models.EmailField(max_length=255, unique=True)
    status = models.BooleanField(default=False)
    gender_preference = models.IntegerField(choices=GENDER_PREFERENCE, default=2)
    password = models.CharField(max_length=128, blank=True, null=True)  # ✅ Allow blank passwords
    google_id = models.CharField(max_length=255, unique=True)
    name = models.TextField()
    identity = models.ForeignKey("Identity", on_delete=models.SET_NULL, null=True, blank=True)
    profile_pic = models.TextField()
    profile_pic_file = models.ImageField(upload_to="profile_pics/", null=True, blank=True)
    ten_on_ten = models.TextField(null=True, blank=True)
    scene_frequency= models.ForeignKey("SceneFrequency", on_delete=models.SET_NULL, null=True, blank=True)
    who_is_around = models.ForeignKey("WhoIsAround", on_delete=models.SET_NULL, null=True, blank=True)
    nostalgias = models.ManyToManyField(Nostalgia, related_name="users")
    gmail_pic = models.TextField()
    travel_type = models.ForeignKey("TravelType", on_delete=models.SET_NULL, null=True, blank=True)
    about = models.TextField()
    instagram_id = models.TextField(null=True, blank=True)
    linkedin_id = models.TextField(null=True, blank=True)
    college = models.ForeignKey("College", on_delete=models.SET_NULL, null=True, blank=True)

    # ✅ New fields for Google OAuth
    google_access_token = models.TextField(null=True, blank=True)
    google_refresh_token = models.TextField(null=True, blank=True)
    google_token_expiry = models.DateTimeField(null=True, blank=True)

    # ✅ Required fields for Django Authentication
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "gmail"  # Login using email instead of username
    REQUIRED_FIELDS = ["google_id", "name"]

    def __str__(self):
        return self.name

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True
    
class UserSecretData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mobile_no = models.CharField(max_length=11, null=True, blank=True)

    def __str__(self):
        return self.user.name

class Friend(models.Model):
    FRIEND_STATUS = [
        (0, "WAITING"),
        (1, "FRIENDS"),
    ]
    
    request_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_friend_requests"
    )
    friend = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_friend_requests"
    )
    status = models.IntegerField(choices=FRIEND_STATUS, default=0)

    class Meta:
        unique_together = ("request_user", "friend")  # Ensures unique friend request pairs

    
class Follwers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")

class Queries(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    query = models.TextField()
    def __str__(self):
        return self.query
    
class SceneType(models.Model):
    scene_name = models.CharField(max_length=255)

    def __str__(self):
        return self.scene_name

def get_current_unix_timestamp():
    """Returns the current Unix timestamp as an integer."""
    return int(timezone.now().timestamp())

class Scene(models.Model):
    SCENE_VISIBILITY = [
        (0, "PUBLIC"),
        (1, "PRIVATE"),
        (2, "PROTECTED"),
    ]
    SCENE_TYPE = [
        (0, "PARTY"),
        (1, "CHILL"),
        (2, "TRAVEL"),
        (3, "EAT"),
    ]
    name = models.TextField()
    priority = models.PositiveIntegerField(unique=True, blank=True, null=True)
    location_text = models.CharField(max_length=255, default="")
    
    # Store timestamps as Unix timestamps (BIGINT)
    start_time = models.BigIntegerField(default=get_current_unix_timestamp)
    end_time = models.BigIntegerField(default=get_current_unix_timestamp)
    
    user_organizer = models.ForeignKey(User, on_delete=models.CASCADE, default=1, related_name="organized_scenes")
    capacity = models.IntegerField(default=100)
    occupancy = models.IntegerField(default=0)
    about = models.TextField(null=True, blank=True)
    scene_type = models.IntegerField(choices=SCENE_TYPE, default=0)
    type = models.ForeignKey('SceneType', on_delete=models.SET_NULL, null=True, blank=True)
    scene_image = models.TextField(default="https://github.com/shadcn.png")
    visitors = models.ManyToManyField(User, through="VisitorList", related_name="visited_scenes")
    visibility = models.IntegerField(choices=SCENE_VISIBILITY, default=0)

    def __str__(self):
        return self.name
    
class RestaurantScene(models.Model):
    user_organizer = models.ForeignKey(User, on_delete=models.CASCADE, default=1, related_name="restaurant_scenes")
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    location_text = models.CharField(max_length=255, default="")
    start_time = models.BigIntegerField(default=get_current_unix_timestamp)
    end_time = models.BigIntegerField(default=get_current_unix_timestamp)
    scene_image= models.TextField(default="https://awsscenebucket.s3.eu-north-1.amazonaws.com/scene_default_poster.png")
    def __str__(self):
        return self.name
    
class RestaurantItineraryItem(models.Model):
    scene = models.ForeignKey(RestaurantScene, on_delete=models.CASCADE, default=1, related_name="itinerary_items")
    spot_name = models.CharField(max_length=255, unique=True, db_index=True)
    notes = models.JSONField(default=list)
    time = models.BigIntegerField(default=get_current_unix_timestamp)
    def __str__(self):
        return self.spot_name

class Invite(models.Model):
    INVITE_STATUS = [
        (0, "PENDING"),
        (1, "ACCEPTED"),
        (2, "REJECTED"),
        (3, "CANCELLED"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant_scene = models.ForeignKey(RestaurantScene, on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invites_received")
    status = models.IntegerField(choices=INVITE_STATUS, default=0)
    def __str__(self):
        return f"{self.user.name} → {self.to_user.name} for {self.restaurant_scene.name}"

class ItineraryItem(models.Model):
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE, default=1)
    spot_name = models.CharField(max_length=255, unique=True, db_index=True)
    notes = models.JSONField(default=list)
    time = models.BigIntegerField(default=get_current_unix_timestamp)
    def __str__(self):
        return self.spot_name

class ChecklistItem(models.Model):
    CHECKLIST_FILTER = [
        (1, "CLOTHING"),
        (2, "PERSONAL"),
        (3, "GIRLLY"),
        (4, "DOCUMENT"),
        (5, "MISCELLANEOUS"),
        (6, "TRAVEL-ESSENTIALS"),
    ]
    checkfilter = models.IntegerField(choices=CHECKLIST_FILTER, null=True)
    item = models.TextField()
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE, default=1)
    def __str__(self):
        return self.item

class VisitorList(models.Model):
    VISITOR_TYPES = [
    (0, "ORGANIZER"),
    (1, "ACCEPTED"),
    (2, "INVITED"),
    (3, "REQUESTED"),
    (4, "CANCELLED"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE)
    status = models.IntegerField(choices=VISITOR_TYPES, default=2)
    def __str__(self):
        return f"{self.user.name} → {self.scene.name}"

class Notifications(models.Model):
    NOTIFICATION_TYPES = [
    (0, "ADDITION"), # confirmed by invitation or join request
    (1, "REMOVAL"), # removed from the scene
    (2, "CANCELLED"), # user cancelled the plan
    (2, "REMINDER"), # scene is about to begin
    (3, "UPDATE"), # someone is added
    # for admin
    (4, "REQUESTED_INVITATION"), # being part of scene has been requested
    (5, "ACCEPTED_INVITATION"), # request has been accepted
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.IntegerField(choices=NOTIFICATION_TYPES, default=0)
    message = models.TextField()
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    # timestamp_unix = models.BigIntegerField(default=get_current_unix_timestamp)
    def __str__(self):
        user_name = self.user.name if self.user else "Unknown User"
        scene_name = self.scene.name if self.scene else "Unknown Scene"
        return f"{user_name} → {scene_name}"
    

