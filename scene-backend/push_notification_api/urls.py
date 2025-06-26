from django.urls import path, include
from rest_framework.routers import DefaultRouter
from push_notification_api.views import save_subscription


urlpatterns = [
    path('save-subscription/', save_subscription),
]
