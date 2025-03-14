from rest_framework import permissions


class IsAccountOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            username = view.kwargs.get('username')
            return bool(request.user.username == username)
        return False


class IsAccountOwnerOrReadOnly(IsAccountOwner):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_object_permission(request, view, obj)


class IsSeller(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return request.user.is_seller()
        return False


class IsAgent(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return request.user.is_agent()
        return False


class IsSellerOrAgent(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return bool(request.user.is_seller() or request.user.is_agent())
        return False
