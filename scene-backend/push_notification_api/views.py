from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from push_notification_api.models import PushSubscription
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_subscription(request):
    try:
        data = json.loads(request.body)

        PushSubscription.objects.update_or_create(
            user=request.user,
            defaults={
                "endpoint": data["endpoint"],
                "keys_auth": data["keys"]["auth"],
                "keys_p256dh": data["keys"]["p256dh"],
            }
        )

        return JsonResponse({"status": "success"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)