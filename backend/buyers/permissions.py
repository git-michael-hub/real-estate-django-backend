from rest_framework import permissions


class IsBuyerAccountOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            return bool(request.user.buyer_account.id == obj.id)
        return False


class IsBuyerAccountOwnerOrReadOnly(IsBuyerAccountOwner):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_object_permission(request, view, obj)
