from rest_framework import permissions


class IsSellerAccountOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            return bool(request.user.seller_account.id == obj.id)
        return False


class IsSellerAccountOwnerOrReadOnly(IsSellerAccountOwner):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_object_permission(request, view, obj)
