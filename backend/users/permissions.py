from rest_framework import permissions


class IsAccountOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        username = view.kwargs.get('username')
        return (request.user.is_authenticated and
                request.user.username == username)


class IsAccountOwnerOrReadOnly(IsAccountOwner):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_object_permission(request, view, obj)
