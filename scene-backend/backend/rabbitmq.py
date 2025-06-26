# import pika
# import json

# def send_notification_to_queue(message):
#     connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
#     channel = connection.channel()
#     channel.queue_declare(queue="notifications")

#     channel.basic_publish(
#         exchange="", routing_key="notifications", body=json.dumps({"message": message})
#     )
#     connection.close()