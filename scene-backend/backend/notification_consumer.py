# import pika
# import json
# import os
# import django

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project.settings")
# django.setup()

# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync

# def callback(ch, method, properties, body):
#     channel_layer = get_channel_layer()
#     message = json.loads(body)
    
#     async_to_sync(channel_layer.group_send)(
#         "notifications", {"type": "send_notification", "message": message["message"]}
#     )

# def start_consuming():
#     connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
#     channel = connection.channel()
#     channel.queue_declare(queue="notifications")

#     channel.basic_consume(queue="notifications", on_message_callback=callback, auto_ack=True)

#     print(" [*] Waiting for messages. To exit press CTRL+C")
#     channel.start_consuming()