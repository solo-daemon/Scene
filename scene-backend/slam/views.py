from django.shortcuts import render
from rest_framework import (
    viewsets,
    status,
    )
from rest_framework.decorators import action
from slam.serializers import (
    SlamViewSerializer,
    SlamFromListSerializer,
    SlamForListSerializer,
    SlamCreateSerializer
    )
from slam.models import Slam
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from access_control.permissions import NotBlockedPermission
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import MethodNotAllowed
User = get_user_model()
# Create your views here.

class SlamViewset(viewsets.ModelViewSet):
    queryset = Slam.objects.all()
    serializer_class = SlamViewSerializer
    permission_classes=[NotBlockedPermission, IsAuthenticated]
    def retrieve(self, request, *args, **kwargs):
        slam = self.get_object()
        user = request.user
        if slam.to_user != user and slam.from_user != user:
            return Response({"detail": "You do not have permission to view this slam."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(slam)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")    

    def list(self, request):
        user = request.user
        queryset_to = Slam.objects.filter(to_user=user, status=1)
        queryset_from = Slam.objects.filter(from_user=user)
        serializer_to = SlamFromListSerializer(queryset_to, many=True)
        serializer_from = SlamForListSerializer(queryset_from, many=True)
        return Response({
            "for_user": serializer_to.data,
            "from_user": serializer_from.data,
        }, status=status.HTTP_200_OK)
    
    def create(self, request):
        to_user_id = request.data.get("user_id")
        if not to_user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            to_user = User.objects.get(id=to_user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if Slam already exists
        existing_slam = Slam.objects.filter(to_user=to_user, from_user=request.user).first()
        if existing_slam:
            if existing_slam.status == 1:
                return Response(
                    {"detail": "You cannot edit an already sent slam."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                # Slam exists and is still pending (status = 0), so update it
                serializer = SlamCreateSerializer(existing_slam, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # No existing slam, so create a new one
        data = request.data.copy()
        data["to_user"] = to_user.id
        data["from_user"] = request.user.id

        serializer = SlamCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=["get"], url_path="get-slam")
    def get_slamData(self, request):
        to_user_id = request.query_params.get("user_id")  # use query_params for GET
        if not to_user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            to_user = User.objects.get(id=to_user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if Slam exists and status is 0
        existing_slam = Slam.objects.filter(to_user=to_user, from_user=request.user).first()
        if existing_slam:
            serializer = self.serializer_class(existing_slam)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Slam not found or already sent"}, status=status.HTTP_404_NOT_FOUND)

    


