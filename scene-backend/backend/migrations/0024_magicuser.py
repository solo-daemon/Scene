# Generated by Django 5.1.7 on 2025-05-12 19:15

import backend.models
import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0023_alter_user_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='MagicUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default=uuid.uuid4, max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField(default=backend.models.default_expiry)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='magic_links', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
