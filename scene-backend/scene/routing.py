from django.urls import re_path
from backend.consumers import NotificationConsumer
# from .consumers import NotificationConsumer

websocket_urlpatterns = [
    re_path(r"ws/notifications/(?P<room_name>\w+)/$", NotificationConsumer.as_asgi()),
]