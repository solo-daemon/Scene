from django.contrib import admin
from .models import UserBlock

@admin.register(UserBlock)
class UserBlockAdmin(admin.ModelAdmin):
    list_display = ('blocked_user', 'created_at')
    search_fields = ('blocked_user__name', 'blocked_user__gmail')
