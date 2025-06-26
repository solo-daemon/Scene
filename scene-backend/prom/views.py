from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, action
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import MethodNotAllowed
from rest_framework import (
    viewsets,
    status
)
from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model

from rest_framework.response import Response
from prom.models import PromCouples
from prom.serializers import PromCoupleSerializer
from backend.serializers import UserListSerializer
from access_control.permissions import NotBlockedPermission
User = get_user_model()

class PromCoupleViewSet(viewsets.ModelViewSet):
    queryset = PromCouples.objects.all()
    serializer_class = PromCoupleSerializer
    permission_classes=[IsAuthenticated, NotBlockedPermission]

    def list(self, request, *args, **kwargs):
        raise MethodNotAllowed("GET")

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed("POST")
    
    def retrieve(self, request, *args, **kwargs):
        raise MethodNotAllowed("GET")
    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT")
    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH")
    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE")
    def perform_destroy(self, instance):
        raise MethodNotAllowed("DELETE")

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated, NotBlockedPermission])
    def check_prom_status(self, request):
        user = request.user
        profile_id = request.data.get("profile_id")

        if not profile_id:
            return Response({"message": "profile_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            to_user = User.objects.get(id=profile_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if PromCouples.objects.filter(user=user, to_user=to_user, status=2).exists():
             return Response({"can_send": "TOO_LATE"}, status=status.HTTP_200_OK)
        

        if PromCouples.objects.filter(
            Q(user=user, to_user=to_user, status=1) |
            Q(user=to_user, to_user=user, status=1)
        ).exists():
            return Response({"can_send": "ACCEPTED"}, status=status.HTTP_200_OK)

        if PromCouples.objects.filter(
            status=1
        ).filter(
            (models.Q(user=to_user) | models.Q(to_user=to_user)) &
            ~models.Q(user=to_user, to_user=to_user)
        ).exists():
            return Response({"can_send": "TOO_LATE"}, status=status.HTTP_200_OK)

        if PromCouples.objects.filter(user=user, to_user=to_user, status=0).exists():
            return Response({"can_send": "WAITING"}, status=status.HTTP_200_OK)
        
        if PromCouples.objects.filter(user=to_user, to_user=user, status=2).exists():
            return Response({"can_send": "REJECTED"}, status=status.HTTP_200_OK)
        
        if PromCouples.objects.filter(user=to_user, to_user=user, status=0).exists():
            return Response({"can_send": "ACCEPT"}, status=status.HTTP_200_OK)

        # ✅ Otherwise, allow
        return Response({"can_send": "OPEN"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, NotBlockedPermission])
    def get_couple(self, request):
        user = request.user

        accepted_couples = PromCouples.objects.filter(
            Q(user=user) | Q(to_user=user),
            status=1
        )

        pending_couples = PromCouples.objects.filter(
            user=user,
            status=0
        )

        invited_couples = PromCouples.objects.filter(to_user=user, status=0)

        accepted_serializer = self.serializer_class(accepted_couples, many=True)
        pending_serializer = self.serializer_class(pending_couples, many=True)
        invited_serialzier = self.serializer_class(invited_couples, many=True)
        return Response({
            "accepted_couples": accepted_serializer.data,
            "pending_couples": pending_serializer.data,
            "invited_couples": invited_serialzier.data,
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, NotBlockedPermission])
    def get_requests(self, request):
        user = request.user
        requests = PromCouples.objects.filter(to_user=user, status=0)
        serializer = self.serializer_class(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated, NotBlockedPermission])
    def send_prom_request(self, request):
        user = request.user
        to_user_id = request.data.get("to_user_id")

        if not to_user_id:
            return Response({"message": "to_user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        to_user = User.objects.filter(id=to_user_id).first()
        if not to_user:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if self.queryset.filter(to_user=to_user, user=user).exists():
            return Response({"message": "Prom request already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if PromCouples.objects.filter(
            status=1
        ).filter(
            (models.Q(user=to_user) | models.Q(to_user=to_user)) &
            ~models.Q(user=to_user, to_user=to_user)
        ).exists():
            return Response({"message": "to_user is already commited"}, status=status.HTTP_400_BAD_REQUEST)

        prom = PromCouples.objects.create(user=user, to_user=to_user)
        if(to_user == user):
            prom.status = 1
        prom.save()
        serializer = self.serializer_class(prom)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, NotBlockedPermission])
    def prom_accept(self, request, pk=None):
        pair = self.get_object()
        to_user = request.user

        if pair.to_user != to_user:
            return Response({"message": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

        # ❌ Block if to_user is already committed to someone else (not this requester)
        if PromCouples.objects.filter(
            status=1
        ).filter(
            (models.Q(user=to_user) | models.Q(to_user=to_user)) &
            ~models.Q(user=to_user, to_user=to_user)
        ).exists():
            pair.status=2
            pair.save()
            return Response({"message": "you already have a pair, only one couple per user is allowed"}, status=status.HTTP_200_OK)

        pair.status = 1
        pair.save()
        return Response({"message": "Request accepted"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated, NotBlockedPermission], url_path="prom_accept_auto")
    def prom_accept_auto(self, request):
        to_user = request.user
        user_id = request.data.get("user_id")

        if not user_id:
            return Response({"message": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Find pending invite from that user_id
            pair = PromCouples.objects.filter(user=from_user, to_user=to_user, status=0).first()

            if not pair:
                return Response({"message": "No pending request found"}, status=status.HTTP_404_NOT_FOUND)

            # ❌ Check if to_user already committed to someone else
            if PromCouples.objects.filter(
                status=1
            ).filter(
                (models.Q(user=to_user) | models.Q(to_user=to_user)) &
                ~models.Q(user=to_user, to_user=to_user)
            ).exists():
                pair.status = 2  # Deny the pending request
                pair.save()
                return Response({"message": "You already have a pair, only one couple per user is allowed"}, status=status.HTTP_200_OK)

            # ✅ Accept the request
            pair.status = 1
            pair.save()
            return Response({"message": "Request accepted successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, NotBlockedPermission])
    def prom_deny(self, request, pk=None):
        pair = self.get_object()
        to_user = request.user
        if pair.to_user == request.user :
            pair.status = 2
            pair.save()
            return Response({"message": "request denied"}, status=status.HTTP_200_OK)
        return Response({"message": "request not found"}, status=status.HTTP_404_NOT_FOUND)
    


    
    



