from rest_framework import serializers
from django.db.models import Q
from backend.models import (
    Scene, 
    VisitorList, 
    User, 
    Identity, 
    College, 
    TravelType,
    ChecklistItem,
    ItineraryItem,
    Notifications,
    Follwers,
    Branch,
    Friend,
    Nostalgia,
    RestaurantScene,
    Invite,
    RestaurantItineraryItem,
    WhoIsAround,
    SceneFrequency,
    )
from django.utils.timezone import now
from django.utils import timezone

class UserOrganizerSerializer(serializers.ModelSerializer):
    """Serializer to return only name and gmail_pic"""
    profile_pic_url = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id","name", "gmail_pic", "profile_pic_url"]  # ✅ Send only required fields
    def get_profile_pic_url(self, obj):
        request = self.context.get("request")
        if obj.profile_pic_file and hasattr(obj.profile_pic_file, "url"):
            return request.build_absolute_uri(obj.profile_pic_file.url) if request else obj.profile_pic_file.url
        return None

class UserListSerializer(serializers.ModelSerializer):
    """Serializer for List of Users to search, including slugs"""
    
    college_slug = serializers.SerializerMethodField()
    branch_slug = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "gmail_pic", "branch", "year", "college_slug", "branch_slug", "status_text"]

    def get_college_slug(self, obj):
        return obj.college.college_slug if obj.college else None

    def get_branch_slug(self, obj):
        return obj.branch.branch_slug if obj.branch else None

class SceneListSerializer(serializers.ModelSerializer):
    user_organizer = serializers.HiddenField(default=None, write_only=True)  # Auto-set from JWT
    user_organizer_detail = UserOrganizerSerializer(source="user_organizer", read_only=True)  # ✅ Show limited fields in GET
    occupancy = serializers.SerializerMethodField()
    scene_type_display = serializers.SerializerMethodField()
    class Meta:
        model = Scene
        fields = ["id","name", "location_text", "start_time","end_time","scene_image","user_organizer_detail",
                  "capacity","occupancy","user_organizer", "scene_type", "scene_type_display"]
        
    def get_occupancy(self, obj):
        """ Returns count of visitors excluding those with status 4 (CANCELLED) """
        return VisitorList.objects.filter(scene=obj).exclude(status=4).count()
    
    def get_scene_type_display(self, obj):
        return obj.get_scene_type_display()    

class SceneSerializer(serializers.ModelSerializer):
    user_organizer = serializers.HiddenField(default=None, write_only=True)  # Auto-set from JWT
    user_organizer_detail = UserOrganizerSerializer(source="user_organizer", read_only=True)  # ✅ Show limited fields in GET
    visitor_list = serializers.SerializerMethodField()
    occupancy = serializers.SerializerMethodField()
    scene_type_display = serializers.SerializerMethodField()
    class Meta:
        model = Scene
        fields = [
            "id", "name", "priority", "start_time", "end_time",
            "location_text", "user_organizer", "capacity", "occupancy",
            "about", "type", "scene_image", "user_organizer_detail",
            "visitor_list","scene_type_display", "scene_type",
        ]
    def get_scene_type_display(self, obj):
        return obj.get_scene_type_display()

    def get_occupancy(self, obj):
        """ Returns count of visitors excluding those with status 4 (CANCELLED) """
        return VisitorList.objects.filter(scene=obj).exclude(status=4).count()
    
    def get_visitor_list(self, obj):
        """ Returns a list of visitors (only name and gmail_pic) """
        visitors = VisitorList.objects.filter(scene=obj).select_related("user")

        return [
            {"id": visitor.user.id, "name": visitor.user.name, "gmail_pic": visitor.user.gmail_pic, "status": visitor.status}
            for visitor in visitors
        ]
    
class CheckListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = ["checkfilter", "item", "id"]

class ItineraryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryItem
        fields = "__all__"

class IdentitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Identity
        fields = ["id", "identity_name"]

class CollegeSerializer(serializers.ModelSerializer):
     class Meta:
        model = College
        fields = "__all__"  

class TravelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelType
        fields = "__all__"
class TravelSerializerUser(serializers.ModelSerializer):
    class Meta:
        model = TravelType
        fields = ["id","travel_type","description"]

class SceneNotificationSerializer(serializers.ModelSerializer):
    """Serialize scene with only id, name, and user_organizer_detail"""

    user_organizer_detail = serializers.SerializerMethodField()

    class Meta:
        model = Scene
        fields = ["id", "name", "user_organizer_detail"]

    def get_user_organizer_detail(self, obj):
        """Return user organizer details"""
        if obj.user_organizer:
            return {
                "id": obj.user_organizer.id,
                "name": obj.user_organizer.name,
                "gmail_pic": obj.user_organizer.gmail_pic
            }
        return None

class NotificationSerializer(serializers.ModelSerializer):
    """Serialize notifications for user with organizer and scene details"""
    
    user_organizer = serializers.CharField(source="user.user_organizer", read_only=True)
    scene = SceneNotificationSerializer(read_only=True)  # Nested serializer for scene details
    type_text = serializers.SerializerMethodField()  # Convert type to text

    class Meta:
        model = Notifications
        fields = ["id", "user_organizer", "scene", "type", "type_text", "timestamp"]
    def get_type_text(self, obj):
        """Return notification type in text form"""
        return dict(Notifications.NOTIFICATION_TYPES).get(obj.type, "UNKNOWN")

class WhoIsAroundSerializer(serializers.ModelSerializer):
    """Fetches WhoIsAround"""
    class Meta:
        model = WhoIsAround
        fields = "__all__"

class SceneFrequencySerializer(serializers.ModelSerializer):
    """Fetches SceneFrequency"""
    class Meta:
        model = SceneFrequency
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    """ Fetch user details along with the scenes they organized """
    organized_scenes = serializers.SerializerMethodField()
    identity = IdentitySerializer()  # ✅ Nested serializer for full object
    college_slug = serializers.SerializerMethodField()
    branch_name = serializers.SerializerMethodField()    # ✅ Nested serializer for full object
    travel_type = TravelSerializerUser()
    who_is_around = WhoIsAroundSerializer()
    scene_frequency = SceneFrequencySerializer()
    profile_pic_url = serializers.SerializerMethodField()
    organized_scenes_count = serializers.SerializerMethodField()
    yearOfGraduation = serializers.IntegerField(source="year")
    friend_no = serializers.SerializerMethodField()
    nostalgias = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ["id", "name", "gmail_pic", "organized_scenes",
                  "identity", "travel_type", "about", "instagram_id",
                  "linkedin_id", "college_slug","branch_name", "profile_pic","organized_scenes_count",
                   "yearOfGraduation", "friend_no", "profile_pic_url", "ten_on_ten", "nostalgias", "who_is_around", "scene_frequency",
                   "status_text"
                  ]
    def get_nostalgias(self, obj):
        return list(obj.nostalgias.values_list('nostalgia_name', flat=True))
    
    def get_friend_no(self, obj):
        return Friend.objects.filter(
            Q(friend=obj) | Q(request_user=obj),
            status=1  # Only count accepted friends
        ).count()

    def get_college_slug(self, obj):
        return obj.college.college_slug if obj.college else None

    def get_branch_name(self, obj):
        return obj.branch.branch_slug if obj.branch else None

    def get_organized_scenes(self, obj):
        """ Fetch scenes where the user is the organizer """
        scenes = Scene.objects.filter(user_organizer=obj)
        return SceneListSerializer(scenes, many=True).data
    def get_organized_scenes_count(self, obj):
        """Return the number of scenes created by the user"""
        return Scene.objects.filter(user_organizer=obj).count()
    
    def get_profile_pic_url(self, obj):
        request = self.context.get("request")
        if obj.profile_pic_file and hasattr(obj.profile_pic_file, "url"):
            return request.build_absolute_uri(obj.profile_pic_file.url) if request else obj.profile_pic_file.url
        return None
    # def get_profile_pic_url(self, obj):
    #     if obj.profile_pic_file and hasattr(obj.profile_pic_file, "url"):
    #         # Force it to use localhost:8000 during development
    #         return f"http://localhost:8000{obj.profile_pic_file.url}"
    #     return None

    
    
class UserRetreiveSerializer(serializers.ModelSerializer):
    """ Fetch user details along with the scenes they organized """
    organized_scenes = serializers.SerializerMethodField()
    identity = IdentitySerializer()  # ✅ Nested serializer for full object
    college_slug = serializers.SerializerMethodField()
    travel_type = TravelSerializerUser()
    who_is_around = WhoIsAroundSerializer()
    scene_frequency = SceneFrequencySerializer()
    branch_name = serializers.SerializerMethodField() 
    organized_scenes_count = serializers.SerializerMethodField()
    friend_status = serializers.SerializerMethodField()
    friend_no = serializers.SerializerMethodField()
    yearOfGraduation = serializers.IntegerField(source="year")
    profile_pic_url = serializers.SerializerMethodField()
    nostalgias = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ["id", "name", "gmail_pic", "organized_scenes",
                  "identity", "travel_type", "about", "instagram_id",
                  "linkedin_id", "college_slug", "profile_pic","organized_scenes_count",
                   "friend_status", "friend_no","branch_name", "yearOfGraduation", "ten_on_ten",
                   "profile_pic_url","nostalgias", "who_is_around", "scene_frequency", "status_text"
                  ]

    def get_nostalgias(self, obj):
        return list(obj.nostalgias.values_list('nostalgia_name', flat=True))
    
    def get_profile_pic_url(self, obj):
        request = self.context.get("request")
        if obj.profile_pic_file and hasattr(obj.profile_pic_file, "url"):
            return request.build_absolute_uri(obj.profile_pic_file.url) if request else obj.profile_pic_file.url
        return None

    def get_friend_no(self, obj):
        return Friend.objects.filter(
            Q(friend=obj) | Q(request_user=obj),
            status=1  # Only count accepted friends
        ).count()
    
    def get_branch_name(self, obj):
        return obj.branch.branch_slug if obj.branch else None

    def get_organized_scenes(self, obj):
        """ Fetch scenes where the user is the organizer """
        scenes = Scene.objects.filter(user_organizer=obj)
        return SceneListSerializer(scenes, many=True).data
    def get_organized_scenes_count(self, obj):
        """Return the number of scenes created by the user"""
        return Scene.objects.filter(user_organizer=obj).count()
    
    def get_friend_status(self, obj):
        """Return if the requesting user is following the target user"""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return Follwers.objects.filter(user=obj, follower=request.user).exists()
        return False
    
    def get_college_slug(self, obj):
        return obj.college.college_slug if obj.college else None
    
class UserProfilePicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["profile_pic_file"]

class BranchSerializer(serializers.ModelSerializer):
    """Fetches Branch"""
    class Meta:
        model = Branch
        fields = "__all__"

class NostalgiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nostalgia
        fields = ['id', 'nostalgia_name']

class UserQuestionSerializer(serializers.ModelSerializer):
    identity = IdentitySerializer(read_only=True)
    college = CollegeSerializer(read_only=True)
    branch = BranchSerializer(read_only=True)
    who_is_around = WhoIsAroundSerializer(read_only=True)
    scene_frequency = SceneFrequencySerializer(read_only=True)
    nostalgias = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True
    )
    travel_type = serializers.PrimaryKeyRelatedField(read_only=True)
    profile_pic_url = serializers.SerializerMethodField()
    yearOfGraduation = serializers.IntegerField(source="year")
    profile_pic_url = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            "identity",
            "travel_type",
            "nostalgias",
            "ten_on_ten",
            "yearOfGraduation",
            "profile_pic_url",
            "about",
            "instagram_id",
            "linkedin_id",
            "college",
            "branch",
            "who_is_around",
            "scene_frequency",
        ]
    def get_profile_pic_url(self, obj):
        request = self.context.get("request")
        if obj.profile_pic_file and hasattr(obj.profile_pic_file, "url"):
            return request.build_absolute_uri(obj.profile_pic_file.url) if request else obj.profile_pic_file.url
        return None
    
class RestaurantSceneSerializer(serializers.ModelSerializer):
    user_organizer_detail = UserOrganizerSerializer(source="user_organizer", read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = RestaurantScene
        fields = ["id", "name", "user_organizer_detail", "start_time", "end_time", "location_text", "status", "scene_image"]

    def get_status(self, obj):
        user = self.context.get("request").user
        if not user or user.is_anonymous:
            return False
        return Invite.objects.filter(
            restaurant_scene=obj,
            to_user=user,
            status=1  # ACCEPTED
        ).exists()
    
class RestaurantItineraryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantItineraryItem
        fields = ["id", "spot_name", "notes", "time"]