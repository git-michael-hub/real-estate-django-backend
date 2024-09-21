from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        try:
            return bool(request.user.seller_account.id == obj.seller.id)
        except:
            return False


class IsOwnerOrReadOnly(IsOwner):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_object_permission(request, view, obj)


class IsSeller(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            return bool(request.user.seller_account)
        except:
            return False


class IsSellerOrReadOnly(IsSeller):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_permission(request, view)
