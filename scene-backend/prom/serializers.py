from rest_framework import serializers
from prom.models import PromCouples
from backend.models import User

class PromUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", ]

class PromCoupleSerializer(serializers.ModelSerializer):
    user = PromUserSerializer()
    to_user=PromUserSerializer()
    class Meta:
        model = PromCouples
        fields = ["id", "user", "to_user", "status"]