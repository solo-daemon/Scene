# backend/views.py
from backend.models import (
    User,
    Scene,
    VisitorList,
    College,
    Identity,
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
    MagicUser,
    WhoIsAround,
    SceneFrequency,
)
from backend.serializers import (
    SceneSerializer,
    UserSerializer,
    UserOrganizerSerializer,
    CollegeSerializer,
    IdentitySerializer,
    TravelTypeSerializer,
    CheckListItemSerializer,
    ItineraryItemSerializer,
    SceneListSerializer,
    NotificationSerializer,
    UserRetreiveSerializer,
    BranchSerializer,
    UserListSerializer,
    UserProfilePicSerializer,
    NostalgiaSerializer,
    UserQuestionSerializer,
    RestaurantSceneSerializer,
    RestaurantItineraryItemSerializer,
    WhoIsAroundSerializer,
    SceneFrequencySerializer,
    UserOrganizerSerializer,
)

from prom.models import PromCouples
import time
import random
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from rest_framework import (
    viewsets,
    status
)
import os
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from backend.models import User
import requests
from django.shortcuts import redirect, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from urllib.parse import urlencode
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
import json
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
import logging
import math
from rest_framework.exceptions import MethodNotAllowed
logger = logging.getLogger(__name__)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # default page size
    page_size_query_param = 'page_size'  # allow frontend to control page size
    max_page_size = 100


@csrf_exempt
@login_required
def create_scene_event(request):
    """Django view to create an event in the user's Google Calendar."""
    user = request.user  # Assuming user is authenticated
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    data = json.loads(request.body)

    event_data = {
        "summary": data.get("summary", "New Scene"),
        "description": data.get("description", ""),
        "start": {"dateTime": data["start_time"], "timeZone": "UTC"},
        "end": {"dateTime": data["end_time"], "timeZone": "UTC"},
    }

    return add_event_to_calendar(user, event_data)

def refresh_google_token(user):
    """Refresh user's Google OAuth token if expired."""
    if not user.google_refresh_token:
        return None  # No refresh token available

    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "refresh_token": user.google_refresh_token,
        "grant_type": "refresh_token",
    }
    
    response = requests.post(token_url, data=token_data)
    token_json = response.json()

    if "access_token" in token_json:
        user.google_access_token = token_json["access_token"]
        user.google_token_expiry = timezone.now() + timedelta(seconds=token_json["expires_in"])
        user.save()
        return user.google_access_token
    else:
        return None  # Refresh failed (user may need to re-authenticate)

def add_event_to_calendar(user, event_data):
    """Add an event (scene) to the user's Google Calendar."""
    # Ensure valid access token
    if user.google_token_expiry <= timezone.now():
        new_token = refresh_google_token(user)
        if not new_token:
            return JsonResponse({"error": "Unable to refresh token, re-authentication required"}, status=400)

    headers = {"Authorization": f"Bearer {user.google_access_token}", "Content-Type": "application/json"}

    event_url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    response = requests.post(event_url, headers=headers, json=event_data)

    if response.status_code == 200 or response.status_code == 201:
        return JsonResponse({"message": "Event added successfully", "event": response.json()})
    else:
        return JsonResponse({"error": response.json()}, status=response.status_code)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_with_magic_code(request):
    code = request.data.get("code")

    if not code:
        return Response({"error": "Code is required"}, status=400)

    try:
        magic_user = MagicUser.objects.get(code=code)
        if not magic_user.is_valid():
            return Response({"error": "Code expired"}, status=401)

        user = magic_user.user
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        return Response({
            "access": access,
            "refresh": str(refresh),
            "user_id": user.id,
            "user_type": user.get_user_type_display(),
        })

    except MagicUser.DoesNotExist:
        return Response({"error": "Invalid code"}, status=404)

# Step 2: Handle Google's response and authenticate user
@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth_callback(request):
    code = request.data.get("code")
    if not code:
        return Response({"error": "Missing code"}, status=status.HTTP_400_BAD_REQUEST)

    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,  # Same as frontend redirect URI set in Google Console
        "grant_type": "authorization_code",
    }

    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()

    if "error" in token_json:
        logger.error("Failed to get access token: %s", token_json)
        return Response({"error": "Failed to get access token", "details": token_json}, status=400)

    try:
        access_token = token_json.get("access_token")
        refresh_token = token_json.get("refresh_token")
        expires_in = token_json.get("expires_in")

        # Now fetch user info
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_info_response = requests.get(user_info_url, headers=headers)
        user_data = user_info_response.json()

        google_id = user_data.get('id')
        gmail = user_data.get('email')
        name = user_data.get('name')
        profile_pic = user_data.get('picture')

        if not gmail or not google_id:
            logger.error(f"Missing required user info: {user_data}")
            return Response({"error": "Missing user info"}, status=400)

        user, created = User.objects.get_or_create(
            google_id=google_id,
            defaults={
                "gmail": gmail,
                "name": name,
                "profile_pic": profile_pic,
                "gmail_pic": profile_pic,
                "about": "",
                "google_access_token": access_token,
                "google_refresh_token": refresh_token,
                # "google_token_expiry": timezone.now() + timedelta(seconds=expires_in),
            },
        )

        if not created:
            user.google_access_token = access_token
            user.google_refresh_token = refresh_token or user.google_refresh_token
            user.save()

        allowed_emails = ["jaiswal.parnika09@gmail.com", "priyanshichikhale@gmail.com", "vmudgal0112@gmail.com", "gaurangij005@gmail.com"]

        if not gmail or (not gmail.endswith('.iitr.ac.in') and gmail not in allowed_emails):
            return Response(
                {"message": "Only IITR email addresses or approved accounts are allowed."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        access_token_jwt = str(refresh.access_token)
        refresh_token_jwt = str(refresh)

        return Response({
            "access": access_token_jwt,
            "refresh": refresh_token_jwt,
            "user_id": user.id,
            "user_type": user.get_user_type_display(),
        })

    except Exception as e:
        logger.exception("Error during Google auth token exchange")
        return Response({"error": "Internal server error"}, status=500)

def google_login(request):
    google_auth_url = "https://accounts.google.com/o/oauth2/auth"
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        "access_type": "offline",
        "prompt": "consent",
    }
    return redirect(f"{google_auth_url}?{urlencode(params)}")

class UserViewSet(viewsets.ViewSet):
    """ API endpoint for fetching user info along with organized scenes """
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    pagination_class = StandardResultsSetPagination
    def get_permissions(self):
        if self.action == "nearby_home":
            return [AllowAny()]
        elif self.action == "nearby":
            return [AllowAny()]
        return [IsAuthenticated()]

    def list(self, request):
        """ Return List of Users when accessing """
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """ Fetch user by ID and return their organized scenes """
        user = get_object_or_404(User, pk=pk)
        serializer = UserRetreiveSerializer(user)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")    
    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed("POST")
    
    @action(detail=False, methods=["get"])
    def is_social_completed(self, request):
        user = request.user

        instagram_completed = bool(user.instagram_id and user.instagram_id.strip())
        linkedin_completed = bool(user.linkedin_id and user.linkedin_id.strip())

        if instagram_completed and linkedin_completed:
            return Response({"social_completed": True}, status=status.HTTP_200_OK)
        else:
            return Response({"social_completed": False}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="status_text")
    def status_text(self, request):
        status_text = request.data.get("status_text")
        status_user = request.data.get("status_user")
        gender_preference = request.data.get("gender_preference")
        if not gender_preference:
            return Response({"error": "Status text, and gender Preference is required"}, status=status.HTTP_400_BAD_REQUEST)

        if status_user is None:
            return Response({"error": "Status user is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if(gender_preference == "MEN"):
            user.gender_preference = 0
        if(gender_preference == "WOMEN"):
            user.gender_preference = 1
        if(gender_preference == "BOTH"):
            user.gender_preference = 2
        user.status_text = status_text
        user.status = status_user
        user.save()

        return Response({"message": "Status text updated successfully."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="questions")
    def questions(self, request):
        user = request.user
        if not user:
            return Response({"error": "User is required"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserQuestionSerializer(user)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], url_path="ten-on-ten")
    def tenOnten(self,request):

        tenOnten = request.data.get("ten_on_ten")
        if not tenOnten:
            return Response({"error": "Ten on Ten Field in required"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.ten_on_ten = tenOnten
        user.save()
        return Response({"message": "About updated successfully."}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='set-nostalgias')
    def set_nostalgias(self, request):
        nostalgia_ids = request.data.get("nostalgia_ids", [])

        if not isinstance(nostalgia_ids, list):
            return Response({"detail": "nostalgia_ids must be a list."}, status=status.HTTP_400_BAD_REQUEST)

        nostalgias = Nostalgia.objects.filter(id__in=nostalgia_ids)

        if nostalgias.count() != len(nostalgia_ids):
            return Response({"detail": "One or more IDs are invalid."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.nostalgias.set(nostalgias)
        user.save()

        return Response({
            "message": "Nostalgias updated successfully.",
            "nostalgias": list(user.nostalgias.values_list('nostalgia_name', flat=True))
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["post"], url_path="year_update")
    def year_update(self, request):
        """Update the year user is passing out"""
        user = request.user
        year = request.data.get("year")
        if not year:
            return Response({"error": "Not allowed"}, status=status.HTTP_401_UNAUTHORIZED)
        user.year = year
        user.save()
        return Response({"message": "Year has been update successfully"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="follow")
    def follow(self, request):
        """Allows the authenticated user to follow another user"""
        user = request.user
        target_user_id = request.data.get("user_id")

        if not target_user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        if str(user.id) == str(target_user_id):
            return Response({"error": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        target_user = get_object_or_404(User, id=target_user_id)

        # Check if already following
        if Follwers.objects.filter(user=target_user, follower=user).exists():
            return Response({"message": "You are already following this user."}, status=status.HTTP_400_BAD_REQUEST)

        # Create follow relationship
        Follwers.objects.create(user=target_user, follower=user)

        return Response({"message": "Successfully followed the user."}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["delete"], url_path="unfollow")
    def unfollow(self, request):
        """Allows the authenticated user to unfollow another user"""
        user = request.user
        target_user_id = request.query_params.get('id')
        if not target_user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        target_user = get_object_or_404(User, id=target_user_id)
        # Check if following exists
        follow_relation = Follwers.objects.filter(user=target_user, follower=user)
        if not follow_relation.exists():
            return Response({"message": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)

        # Remove follow relationship
        follow_relation.delete()

        return Response({"message": "Successfully unfollowed the user."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="friend_list")
    def friend_list(self, request):
        user = request.user
        friends = Friend.objects.filter(
            Q(request_user=user) | Q(friend=user),
            status=1
        )

        friend_users = [
            f.friend if f.request_user == user else f.request_user
            for f in friends
        ]

        serialized = UserListSerializer(friend_users, many=True)
        return Response(serialized.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="search")
    def search(self, request):
        """ Search users by name, excluding NORMAL users """
        search_text = request.data.get("text", "")
        results = self.queryset.filter(
            name__icontains=search_text,
            gmail__iendswith=".iitr.ac.in",
            ).exclude(user_type=1)
        serializer = UserListSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"], url_path="search_prom", permission_classes=[IsAuthenticated])
    def search_prom(self, request):
        user = request.user

        if user.gender_preference == 0:
            identity = Identity.objects.get(identity_name="he/him")
            queryset = self.queryset.filter(
                gmail__iendswith=".iitr.ac.in",
                status=True,
                identity=identity
            ).exclude(user_type=1)
        elif user.gender_preference == 1:
            identity = Identity.objects.get(identity_name="she/her")
            queryset = self.queryset.filter(
                gmail__iendswith=".iitr.ac.in",
                status=True,
                identity=identity
            ).exclude(user_type=1)
        else:
            queryset = self.queryset.filter(
                gmail__iendswith=".iitr.ac.in",
                status=True
            ).exclude(user_type=1)

        paginator = StandardResultsSetPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = UserListSerializer(paginated_queryset, many=True)

        total_count = paginator.page.paginator.count
        page_size = paginator.get_page_size(request)
        total_pages = math.ceil(total_count / page_size)

        return Response({
            "count": total_count,
            "page_size": page_size,
            "total_pages": total_pages,
            "current_page": paginator.page.number,
            "next": paginator.get_next_link(),
            "previous": paginator.get_previous_link(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"], url_path="activity")
    def activity(self, request):
        """Fetches number of invitations, latest notifications & pending friend requests"""
        user = request.user

        # Count of Invited Users (status=2)
        invite_count = VisitorList.objects.filter(user=user, status=2).count()

        # Fetch Top 10 Notifications for User
        notifications = Notifications.objects.filter(user=user).order_by("-timestamp")[:10]
        
        # Serialize Notifications
        notifications_data = NotificationSerializer(notifications, many=True)

        # Count of Pending Friend Requests (status=0) where friend = request.user
        friend_no = Friend.objects.filter(friend=user, status=0).count()
        prom_no = PromCouples.objects.filter(to_user=user, status=0).count()
        return Response(
            {
                "invited_count": invite_count,
                "notifications": notifications_data.data,
                "friend_no": friend_no,
                "prom_no": prom_no,
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["get"])
    def activity_count(self, request):
        """Fetches number of invitations, latest notifications & pending friend requests"""
        user = request.user

        invite_count = VisitorList.objects.filter(user=user, status=2).count()

        # Count of Pending Friend Requests (status=0) where friend = request.user
        friend_no = Friend.objects.filter(friend=user, status=0).count()
        prom_no = PromCouples.objects.filter(to_user=user, status=0).count()
        return Response({"activity_count": invite_count + friend_no + prom_no}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="isProfileDone")
    def isProfileDone(self, request, pk=None):
        """Check if the user profile is completed"""
        user = get_object_or_404(User, pk=pk)

        is_complete = all([
            user.year is not None,
            user.identity is not None,
            user.college is not None,
            user.branch is not None,
        ])

        return Response({"isProfileDone": is_complete}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"], url_path="basic-info")
    def basic_info(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        serializer = UserOrganizerSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def about(self,request):
        user = request.user
        about = request.data.get("about")
        if not about:
            return Response({"error": "User ID and About are required."}, status=status.HTTP_400_BAD_REQUEST)

        user.about = about
        user.save()
        return Response({"message": "About updated successfully."}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["post"])
    def collegeyearbranch(self,request):
        user = request.user
        college_id = request.data.get("college_id")
        branch_id = request.data.get("branch_id")
        year = request.data.get("year")

        if not (college_id or branch_id or year):
            return Response({"error": "User ID and College ID and Branch ID and Year are required."}, status=status.HTTP_400_BAD_REQUEST)

        college = get_object_or_404(College, id=college_id)
        branch = get_object_or_404(Branch, id=branch_id)
        user.college = college
        user.branch = branch
        user.year = year
        user.save()

        return Response({"message": "College, Branch and Year updated successfully."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def socials(self,request):
        user = request.user
        instagram = request.data.get("instagram")
        linkedin = request.data.get("linkedin")
        if  not (instagram or linkedin):
            return Response({"error": "User ID and Instagram URL and linkedin are required."}, status=status.HTTP_400_BAD_REQUEST)


        user.instagram_id = instagram
        user.linkedin_id = linkedin
        user.save()

        return Response({"message": "Socials updated successfully."}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"])
    def join_requests(self, request):
        user_id = request.user.id
        user = get_object_or_404(User,id = user_id)
        invitations = VisitorList.objects.filter(user = user, status=2).select_related("scene__user_organizer")
        data = [
            {
                "scene_id": invitation.scene.id,
                "scene_name": invitation.scene.name,
                "user_organizer": {
                    "id": invitation.scene.user_organizer.id,
                    "name": invitation.scene.user_organizer.name,
                    "gmail_pic": invitation.scene.user_organizer.gmail_pic,  # Add more fields if needed
                },
            }
            for invitation in invitations
        ]

        return Response(data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"])
    def friend_requests(self, request):
        user = request.user

        # Get all Friend objects where current user is the recipient of a pending request
        pending_requests = Friend.objects.filter(friend=user, status=0)

        # Extract all request_users from those pending requests
        request_users = [f.request_user for f in pending_requests]

        # Serialize those users using the minimal serializer
        serialized_users = UserOrganizerSerializer(request_users, many=True)

        return Response(
            serialized_users.data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["get"])
    def user_status(self, request):
        user = request.user

        return Response({
        "status": user.status,
        "status_text": user.status_text,
        "gender_preference": user.get_gender_preference_display(),  # <- updated here
    }, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def nearby_home(self, request):
        """ List of Nearby people (shortened version) """
        user = request.user
        users = []
        if(user.gender_preference == 0):
            identity = Identity.objects.get(identity_name = "he/him")
            users = self.queryset.filter(gmail__iendswith=".iitr.ac.in", status=True, identity = identity).exclude(id=user.id).exclude(user_type=1).order_by("-id")[:10]
        elif(user.gender_preference == 1):
            identity = Identity.objects.get(identity_name = "she/her")
            users = self.queryset.filter(gmail__iendswith=".iitr.ac.in", identity=identity , status=True).exclude(id=user.id).exclude(user_type=1).order_by("-id")[:10]
        else:
            users = self.queryset.filter(gmail__iendswith=".iitr.ac.in" , status=True).exclude(id=user.id).exclude(user_type=1).order_by("-id")[:10]
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def nearby(self, request):
        """ List of Nearby people (shortened version) """
        user = request.user
        users = self.queryset.filter(gmail__iendswith=".iitr.ac.in").exclude(id=user.id).exclude(user_type=1).order_by("-id")[:10]
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="explore-users")
    def explore_users(self, request):
        """Paginated list of all users except the current user"""
        paginator = StandardResultsSetPagination()
        paginated_queryset = paginator.paginate_queryset(self.queryset, request)
        serializer = UserListSerializer(paginated_queryset, many=True)

        total_count = paginator.page.paginator.count
        page_size = paginator.get_page_size(request)
        total_pages = math.ceil(total_count / page_size)

        return Response({
            "count": total_count,
            "page_size": page_size,
            "total_pages": total_pages,
            "current_page": paginator.page.number,
            "next": paginator.get_next_link(),
            "previous": paginator.get_previous_link(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)

class RestaurantSceneViewSet(viewsets.ModelViewSet):
    queryset = RestaurantScene.objects.all()
    serializer_class = RestaurantSceneSerializer
    def get_permissions(self):
        if self.action == "list":
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")    
    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed("POST")
    
    def list(self, request, *args, **kwargs):
        top_scenes = self.queryset.order_by("-id")[:20]  # You can also sort by another field
        serializer = self.get_serializer(top_scenes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(user_organizer=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"id": serializer.instance.id}, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=["get"])
    def fetch_invites(self, request, pk=None):
        scene = self.get_object()
        user = request.user

        if not user or user.is_anonymous:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        # Step 1: Find who invited the current user to this scene
        inviter_qs = Invite.objects.filter(to_user=user, restaurant_scene=scene)
        if not inviter_qs.exists():
            return Response({"detail": "You were not invited to this scene."}, status=status.HTTP_404_NOT_FOUND)

        inviter = inviter_qs.first().user  # assuming only one person invites a user

        # Step 2: Get all invites sent by that inviter for the same scene
        invites = Invite.objects.filter(user=inviter, restaurant_scene=scene).select_related("to_user")

        data = [
            {
                "id": invite.to_user.id,
                "name": invite.to_user.name,
                "gmail_pic": invite.to_user.gmail_pic,
                "status": invite.get_status_display(),
            }
            for invite in invites
        ]

        return Response(data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["post"])
    def invite(self, request, pk=None):
        scene = self.get_object()
        user = request.user
        user_ids = request.data.get("userIds", [])

        if not isinstance(user_ids, list) or not all(isinstance(i, int) for i in user_ids):
            return Response({"detail": "userIds must be a list of integers."}, status=status.HTTP_400_BAD_REQUEST)

        invites_created = []
        for uid in user_ids:
            to_user = User.objects.filter(id=uid).first()
            if not to_user or to_user == user:
                continue

            # Check if to_user already has *any* invite to the same scene
            already_invited = Invite.objects.filter(
                to_user=to_user,
                restaurant_scene=scene
            ).exists()

            if already_invited:
                continue

            invite = Invite.objects.create(
                user=user,
                to_user=to_user,
                restaurant_scene=scene,
                status=0  # PENDING
            )
            invites_created.append(to_user.id)

        return Response({
            "detail": "Invites sent.",
            "invited_user_ids": invites_created
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=["get"])
    def join_scene(self, request, pk=None):
        scene = self.get_object()
        user = request.user

        if not user or user.is_anonymous:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if invite already exists for this user and scene
        invite = Invite.objects.filter(
            to_user=user,
            restaurant_scene=scene
        ).first()

        if invite:
            invite.status = 1  # Set to ACCEPTED
            invite.save()
            return Response({"detail": "Your invitation status has been updated to ACCEPTED."}, status=status.HTTP_200_OK)

        # Create new invite from organizer to user
        Invite.objects.create(
            user=user,
            to_user=user,
            restaurant_scene=scene,
            status=1
        )

        return Response({"detail": "You have successfully joined the scene."}, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=["get", "post"])
    def itinerary(self, request, pk=None):
        """GET returns all itinerary items for this scene.
        POST creates a new itinerary item (only organizer allowed).
        """
        scene = self.get_object()

        if request.method == "GET":
            itinerary_items = scene.itinerary_items.all()  # uses related_name
            serializer = RestaurantItineraryItemSerializer(itinerary_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == "POST":
            if request.user != scene.user_organizer:
                return Response(
                    {"error": "Only the organizer can add itinerary items."},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = RestaurantItineraryItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(scene=scene)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=["delete"])
    def deleteitinerary(self, request, pk=None):
        """Delete an itinerary item"""
        scene = self.get_object()  # ✅ Corrected from scene.get_object()
        user = request.user
        
        if user != scene.user_organizer:
            return Response(
                {"message": "You are not authorized to delete itinerary"},
                status=status.HTTP_403_FORBIDDEN
            )
        itineraryitem_id = request.query_params.get('id')
        if not itineraryitem_id:
            return Response({"message": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        itineraryitem = get_object_or_404(RestaurantItineraryItem, scene=scene, id=itineraryitem_id)
        itineraryitem.delete()

        return Response({"message": "Spot has been removed"}, status=status.HTTP_200_OK)
    
class SceneViewSet(viewsets.ModelViewSet):
    queryset = Scene.objects.all().order_by("priority")
    serializer_class = SceneSerializer
    # permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == "scene_list":
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")    


    def list(self, request):
        paginator = StandardResultsSetPagination()
        paginated_queryset = paginator.paginate_queryset(self.queryset, request)
        serializer = SceneListSerializer(paginated_queryset, many=True)

        total_count = paginator.page.paginator.count
        page_size = paginator.get_page_size(request)
        total_pages = math.ceil(total_count / page_size)
        serializer = SceneListSerializer(paginated_queryset, many=True)
        return Response({
            "count": total_count,
            "page_size": page_size,
            "total_pages": total_pages,
            "current_page": paginator.page.number,
            "next": paginator.get_next_link(),
            "previous": paginator.get_previous_link(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)

    def create(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        random_scene_type = random.randint(0, 3)
        scene = serializer.save(user_organizer=self.request.user, scene_type=random_scene_type)
        VisitorList.objects.create(
            scene=scene,
            user=request.user,
            status=0
        )

        return Response(scene.id, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"])
    def scene_list(self, request):
        scenes = Scene.objects.all().order_by("-id")[:10]
        serializer = SceneListSerializer(scenes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"])
    def get_time(self, request, pk=None):
        """get date Time"""
        scene = self.get_object()
        if scene.user_organizer != request.user:
            return Response("you are not authorized for this data", status=status.HTTP_401_UNAUTHORIZED)
        scene_time_range = {
            "start_time": scene.start_time,
            "end_time": scene.end_time,
        }
        return Response(scene_time_range, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def cancel_plan(self, request, pk=None):
        """Cancel the plan"""
        scene = self.get_object()
        user = request.user
        # check if user is part of visitor_list
        visitor = get_object_or_404(VisitorList, scene=scene, user=user)
        visitor.status = 4
        visitor.save()
        return Response({"message": "You will be missed"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def request_join(self, request, pk=None):
        """Request join to a scene"""
        scene = self.get_object()
        user = request.user
        visitor = VisitorList.objects.filter(scene=scene, user=user).first()

        if visitor:
            return Response({"message": "Request already sent"}, status=status.HTTP_200_OK)
        else:
            visitor = VisitorList.objects.create(user=user , scene = scene, status=3)
            visitor.save()
            return Response({"message": "Request submitted successfully"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def check_user_status(self, request, pk=None):
        """Check user's status in a scene"""
        scene = self.get_object()
        user = request.user

        visitor = VisitorList.objects.filter(scene=scene, user=user).first()

        if visitor:
            return Response({"status": visitor.status}, status=status.HTTP_200_OK)
        else:
            return Response({"status": -1}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def send_invitation(self, request, pk=None):
        """Send invitation to users by admin"""
        scene = self.get_object()
        admin = request.user

        if admin != scene.user_organizer:
            return Response({"message": "You are not the organizer of this scene"}, status=status.HTTP_403_FORBIDDEN)

        user_ids = request.data.get("user_ids", [])

        if not isinstance(user_ids, list):
            return Response({"message": "user_ids must be a list"}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(id__in=user_ids)

        if not users.exists():
            return Response({"message": "No valid users found"}, status=status.HTTP_400_BAD_REQUEST)

        # Get existing (scene, user) combinations
        existing_users = set(
            VisitorList.objects.filter(scene=scene, user__in=users).values_list("user_id", flat=True)
        )

        # Filter out users who are already invited
        new_users = [user for user in users if user.id not in existing_users]

        if not new_users:
            return Response({"message": "All users are already invited"}, status=status.HTTP_200_OK)

        # Create new VisitorList entries
        visitors = [VisitorList(scene=scene, user=user, status=2) for user in new_users]
        VisitorList.objects.bulk_create(visitors)

        # Create notifications for each invited user
        notifications = [
            Notifications(
                user=user,
                type=4,  # REQUESTED_INVITATION
                message=f"You have been invited to join '{scene.name}' by {admin.name}.",
                scene=scene,
                timestamp=now()
            )
            for user in new_users
        ]
        Notifications.objects.bulk_create(notifications)

        return Response({"message": "Invitations have been sent and notifications created"}, status=status.HTTP_200_OK)
    @action(detail=True, methods=["get"])
    def accept_invitation(self, request, pk=None):
        """Accept invitation to a scene"""
        scene = self.get_object()
        user = request.user
        visitor = get_object_or_404(VisitorList, scene=scene , user=user)
        if visitor.status != 2:
            return Response({"message":"You have not been invited to this scene"}, status=status.HTTP_401_UNAUTHORIZED)
        visitor.status = 1
        visitor.save()
        return Response({"message": "Yay! , the scene is set"}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"])
    def deny_invitation(self, request, pk=None):
        """Deny invitation to a scene"""
        scene = self.get_object()
        user = request.user
        visitor = get_object_or_404(VisitorList, scene=scene , user=user)
        if visitor.status != 2:
            return Response({"message":"You have not been invited to this scene"}, status=status.HTTP_401_UNAUTHORIZED)
        visitor.status = 4
        visitor.save()
        return Response({"message": "You will be missed"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def approve_join(self, request, pk=None):
        """ Approves a join request """
        scene = self.get_object()
        user = request.user # scene admin
        approved_user_id = request.data.get("approved_user_id")
        if request.user.id != scene.user_organizer.id:
            return Response({"message": "You are not the organizer of this scene"}, status=status.HTTP_403_FORBIDDEN)
        
        approved_user = get_object_or_404(User, id=approved_user_id)
        visitor = get_object_or_404(VisitorList, user = approved_user, scene=scene)
        visitor.status = 1
        visitor.save()
        return(Response({"message": "Join request approved successfully"}, status=status.HTTP_200_OK))

    @action(detail=True, methods=["post"])
    def deny_join(self, request, pk=None):
        """Denies a join request"""
        scene = self.get_object()
        user = request.user
        denied_user_id = request.data.get("denied_user_id")
        if user != scene.user_organizer:
            return Response({"message": "You are not the organizer of this scene"}, status=status.HTTP_403_FORBIDDEN)
        
        denied_user = get_object_or_404(User, id=denied_user_id)
        visitor = get_object_or_404(VisitorList, user=denied_user, scene=scene)
        visitor.status = 4
        visitor.save()
        return Response({"message": "user successfully removed"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get", "post"])
    def checklistitem(self, request, pk=None):
        """Get or Create a ChecklistItem for the Scene"""
        scene = self.get_object()

        if request.method == "GET":
            checklist_items = scene.checklistitem_set.all()
            serializer = CheckListItemSerializer(checklist_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == "POST":
            user_id = request.user.id
            user = get_object_or_404(User, id = user_id)
            if user != scene.user_organizer:
                return Response({"error": "You are not authorized to create checklist items."}, status=status.HTTP_403_FORBIDDEN)

            serializer = CheckListItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(scene=scene)  
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=["delete"])
    def deletechecklistitem(self, request, pk=None):
        """delete CheckList Item"""
        scene = self.get_object()
        user = request.user
        if user != scene.user_organizer:
            return Response({"error": "You are not authorized to create checklist items."}, status=status.HTTP_403_FORBIDDEN)

        checklistitem_id = request.query_params.get('id')
        if not checklistitem_id:
            return Response({"message": "id is required"}, status=status.HTTP_400_BAD_REQUEST)
        checklistitem = get_object_or_404(ChecklistItem, scene=scene, id=checklistitem_id)
        checklistitem.delete()
        return Response({"message":"Item has been removed"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get","post"])
    def itinerary(self,request, pk=None):
        """add itinerary Item"""
        scene = self.get_object()

        if request.method == "GET":
            itinerary_items = scene.itineraryitem_set.all()
            serializer = ItineraryItemSerializer(itinerary_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        if request.method == "POST":
            user_id = request.user.id
            user = get_object_or_404(User, id = user_id)
            if user != scene.user_organizer:
                return Response({"error": "You are not authorized to create checklist items."}, status=status.HTTP_403_FORBIDDEN)
            serializer = ItineraryItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(scene=scene)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def edititinerary(self, request, pk=None):
        """edit itinerary item"""
        pass

    @action(detail=True, methods=["delete"])
    def deleteitinerary(self, request, pk=None):
        """Delete an itinerary item"""
        scene = self.get_object()  # ✅ Corrected from scene.get_object()
        user = request.user
        
        if user != scene.user_organizer:
            return Response(
                {"message": "You are not authorized to delete itinerary"},
                status=status.HTTP_403_FORBIDDEN
            )
        itineraryitem_id = request.query_params.get('id')
        if not itineraryitem_id:
            return Response({"message": "id is required"}, status=status.HTTP_400_BAD_REQUEST)

        itineraryitem = get_object_or_404(ItineraryItem, scene=scene, id=itineraryitem_id)
        itineraryitem.delete()

        return Response({"message": "Spot has been removed"}, status=status.HTTP_200_OK)
    
class CollegeViewSet(viewsets.ModelViewSet):  
    """API endpoint to list all colleges and allow users to update their college"""
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    http_method_names = ["get", "post"]

    def create(self, request, *args, **kwargs):
        user=request.user
        college_id = request.data.get("college_id")

        if not college_id:
            return Response({"error": "User ID and College ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        college = get_object_or_404(College, id=college_id)

        user.college = college
        user.save()

        return Response({"message": "College updated successfully."}, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")   

class IdentityViewSet(viewsets.ModelViewSet):  
    """API endpoint to list all identities and allow users to update their identity"""
    queryset = Identity.objects.all()
    serializer_class = IdentitySerializer
    http_method_names = ["get", "post"]

    def create(self, request, *args, **kwargs):
        user = request.user
        identity_id = request.data.get("identity_id")

        if not identity_id:
            return Response({"error": "User ID and Identity ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        identity = get_object_or_404(Identity, id=identity_id)

        user.identity = identity
        user.save()

        return Response({"message": "Identity updated successfully."}, status=status.HTTP_200_OK)
    
class SceneFrequencyViewSet(viewsets.ModelViewSet):  
    """API endpoint to list all identities and allow users to update their identity"""
    queryset = SceneFrequency.objects.all()
    serializer_class = SceneFrequencySerializer
    http_method_names = ["get", "post"]

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")   
    
    def create(self, request, *args, **kwargs):
        user = request.user
        scene_frequency_id = request.data.get("scene_frequency_id")

        if  not scene_frequency_id:
            return Response({"error": "User ID and Identity ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        scene_frequency = get_object_or_404(SceneFrequency, id=scene_frequency_id)

        user.scene_frequency = scene_frequency
        user.save()

        return Response({"message": "Scene Frequency updated successfully."}, status=status.HTTP_200_OK)
    
class WhoIsAroundViewSet(viewsets.ModelViewSet):
    """API endpoint to list all identities and allow users to update their identity"""
    queryset = WhoIsAround.objects.all()
    serializer_class = WhoIsAroundSerializer
    http_method_names = ["get", "post"]

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")   
    def create(self, request, *args, **kwargs):
        user = request.user
        who_is_around_id = request.data.get("who_is_around_id")

        if  not who_is_around_id:
            return Response({"error": "User ID and Identity ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        who_is_around = get_object_or_404(WhoIsAround, id=who_is_around_id)

        user.who_is_around = who_is_around
        user.save()

        return Response({"message": "Scene Frequency updated successfully."}, status=status.HTTP_200_OK)
    
class BranchViewSet(viewsets.ModelViewSet):
    """API Endpoint to list all travel type"""
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    http_method_names = ["get", "post"]
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")   
    
    def create(self, request, *args, **kwargs):
        user = request.user
        branch_id = request.data.get("branch_id")

        if  not branch_id:
            return Response({"error": "User ID and Branch ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        branch = get_object_or_404(Branch, id=branch_id)

        user.branch = branch
        user.save()

        return Response({"message": "Branch updated successfully."}, status=status.HTTP_200_OK)

class TravelTypeViewSet(viewsets.ModelViewSet):  
    """API endpoint to list all travel types and allow users to update their travel type"""
    queryset = TravelType.objects.all()
    serializer_class = TravelTypeSerializer
    http_method_names = ["get", "post"]
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")   
    def create(self, request, *args, **kwargs):
        user = request.user
        travel_type_id = request.data.get("travel_type_id")

        if not travel_type_id:
            return Response({"error": "User ID and Travel Type ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        travel_type = get_object_or_404(TravelType, id=travel_type_id)

        user.travel_type = travel_type
        user.save()

        return Response({"message": "Travel type updated successfully."}, status=status.HTTP_200_OK)
    


class NostalgiaViewset(viewsets.ModelViewSet):
    """API to get nostalgia elements"""
    queryset = Nostalgia.objects.all()
    serializer_class = NostalgiaSerializer
    http_method_names = ["get"]
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")   
    
class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated] 
    def post(self, request):
        friend_id = request.data.get("friend")
        
        try:
            friend_user = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if a request already exists in either direction
        existing_request = Friend.objects.filter(
            Q(request_user=request.user, friend=friend_user) | 
            Q(request_user=friend_user, friend=request.user)
        ).first()

        if existing_request:
            return Response({"message": "Friend request already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new friend request
        Friend.objects.create(request_user=request.user, friend=friend_user, status=0)
        return Response({"message": "Friend request sent"}, status=status.HTTP_201_CREATED)


class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        friend_id = request.data.get("friend")

        try:
            friend_user = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Find the friend request where the logged-in user is the recipient
        friend_request = Friend.objects.filter(
            request_user=friend_user, friend=request.user, status=0
        ).first()

        if not friend_request:
            return Response({"message": "No pending request found"}, status=status.HTTP_400_BAD_REQUEST)

        # Accept the request by updating the status
        friend_request.status = 1
        friend_request.save()
        return Response({"message": "Friend request accepted"}, status=status.HTTP_200_OK)

class DenyFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        friend_id = request.data.get("friend")

        try:
            friend_user = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Find the pending friend request
        friend_request = Friend.objects.filter(
            request_user=friend_user,
            friend=request.user,
            status=0
        ).first()

        if not friend_request:
            return Response({"message": "No pending request found"}, status=status.HTTP_400_BAD_REQUEST)

        # Delete the friend request
        friend_request.delete()
        return Response({"message": "Friend request denied and deleted"}, status=status.HTTP_200_OK)


class CheckFriendStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, friend_id):
        try:
            friend_user = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check for existing friendship requests
        friend_request = Friend.objects.filter(
            Q(request_user=request.user, friend=friend_user) | 
            Q(request_user=friend_user, friend=request.user)
        ).first()

        if not friend_request:
            return Response({"status": 0, "message": "No friend request found"})

        # Define status codes
        if friend_request.request_user == friend_user and friend_request.friend == request.user:
            if friend_request.status == 0:
                return Response({"status": 1, "message": "You have a pending friend request"})
            elif friend_request.status == 1:
                return Response({"status": 2, "message": "You are friends"})

        if friend_request.request_user == request.user and friend_request.friend == friend_user:
            if friend_request.status == 0:
                return Response({"status": 3, "message": "Friend request sent, waiting for approval"})
            elif friend_request.status == 1:
                return Response({"status": 4, "message": "You are friends"})

        return Response({"status": 0, "message": "No valid friend request found"})
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_profile_pic(request):
    user = request.user

    if "profile_pic" not in request.FILES:
        return Response({"error": "No file uploaded"}, status=400)

    uploaded_file = request.FILES["profile_pic"]

    # ✅ Delete old profile pic if it exists
    if user.profile_pic_file and default_storage.exists(user.profile_pic_file.name):
        default_storage.delete(user.profile_pic_file.name)

    # ✅ Extract file extension
    extension = os.path.splitext(uploaded_file.name)[1]
    filename = f"user_{user.id}_profile_pic{extension}"

    # ✅ Save new file with correct name
    file_path = default_storage.save(f"profile_pics/{filename}", uploaded_file)

    # ✅ Update user
    user.profile_pic_file = file_path
    user.save()

    return Response({
        "message": "Upload successful!",
        "profile_pic_url": user.profile_pic_file.url
    })


