from django.contrib import admin
from django.apps import apps
from .models import User  # make sure this points to your actual User model

# Register User with custom admin to enable Gmail search
@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    search_fields = ['gmail']
    list_display = ['id', 'name', 'gmail', 'user_type']  # optional but useful
    ordering = ['id']

# Register all other models dynamically except User
app_models = apps.get_app_config('backend').get_models()
for model in app_models:
    if model != User:
        admin.site.register(model)