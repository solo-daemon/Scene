from celery import shared_task
from channels.layers import get_channel_layer
import asyncio
import json

@shared_task
def send_push_notification(user_id, message):
    """Send a notification to a specific user via WebSocket."""
    channel_layer = get_channel_layer()
    asyncio.run(channel_layer.group_send(
        f"user_{user_id}",
        {"type": "send_notification", "message": message},
    ))