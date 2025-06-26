from slam.views import SlamViewset
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'slam', SlamViewset)


urlpatterns = [
    path('', include(router.urls)),
]