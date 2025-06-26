from rest_framework import serializers
from slam.models import Slam
from django.contrib.auth import get_user_model
User = get_user_model()

class SlamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Slam
        fields="__all__"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name"]

class SlamViewSerializer(serializers.ModelSerializer):
    to_user = UserSerializer()
    from_user = UserSerializer()
    class Meta:
        model=Slam
        fields="__all__"

class SlamFromListSerializer(serializers.ModelSerializer):
    from_user = UserSerializer()

    class Meta:
        model = Slam
        fields = ["id", "from_user"]

class SlamForListSerializer(serializers.ModelSerializer):
    to_user = UserSerializer()

    class Meta:
        model = Slam
        fields = ["id", "to_user", "status"]

