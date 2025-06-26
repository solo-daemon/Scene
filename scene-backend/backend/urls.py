# backend/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from backend.views import (
    UserViewSet,
    google_login,
    google_auth_callback,
    SceneViewSet,
    CollegeViewSet,
    IdentityViewSet,
    TravelTypeViewSet,
    BranchViewSet, 
    SendFriendRequestView, 
    AcceptFriendRequestView, 
    CheckFriendStatusView,
    upload_profile_pic,
    NostalgiaViewset,
    RestaurantSceneViewSet,
    WhoIsAroundViewSet,
    SceneFrequencyViewSet,
    DenyFriendRequestView,
    login_with_magic_code,
)

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'scenes', SceneViewSet)
router.register(r'colleges', CollegeViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'identities', IdentityViewSet)
router.register(r'travel-types', TravelTypeViewSet)
router.register(r'nostalgias', NostalgiaViewset)
router.register(r'restaurant-scenes', RestaurantSceneViewSet)
router.register(r'who-is-around', WhoIsAroundViewSet)
router.register(r'scene-frequency', SceneFrequencyViewSet)
# router.register(r'login', LoginViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path("magic-login/", login_with_magic_code, name="login-with-magic-code"),
    path("login/", google_login),
    path("auth/callback/", google_auth_callback),
    path("send-request/", SendFriendRequestView.as_view(), name="send-friend-request"),
    path("accept-request/", AcceptFriendRequestView.as_view(), name="accept-friend-request"),
    path("deny-request/", DenyFriendRequestView.as_view(), name="deny-friend-request"),
    path("check-status/<int:friend_id>/", CheckFriendStatusView.as_view(), name="check-friend-status"),
    path("upload/", upload_profile_pic, name="upload_profile_pic")
]