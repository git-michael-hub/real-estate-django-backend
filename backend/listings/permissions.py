from rest_framework import permissions


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return bool(permissions.IsAuthenticatedOrReadOnly)
        return bool(permissions.IsAuthenticatedOrReadOnly and request.user.id == obj.id)
