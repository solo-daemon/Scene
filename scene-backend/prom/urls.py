from django.urls import path, include
from rest_framework.routers import DefaultRouter
from prom.views import PromCoupleViewSet
router = DefaultRouter()
router.register('prom-couples', PromCoupleViewSet, basename='prom-couples')
urlpatterns = [
    path('', include(router.urls)),
]