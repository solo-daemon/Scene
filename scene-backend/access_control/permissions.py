from rest_framework.permissions import BasePermission
from .models import UserBlock

class NotBlockedPermission(BasePermission):
    """
    Blocks access for users who are blocked by admin.
    """

    def has_permission(self, request, view):
        return not UserBlock.objects.filter(blocked_user=request.user).exists()