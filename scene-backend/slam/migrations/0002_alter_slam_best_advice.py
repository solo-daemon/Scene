# Generated by Django 5.1.7 on 2025-04-16 23:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('slam', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='slam',
            name='best_advice',
            field=models.TextField(blank=True, null=True),
        ),
    ]
