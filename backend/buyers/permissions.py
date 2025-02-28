from rest_framework import permissions


class IsBuyerAccountOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        try:
            return bool(request.user.buyer_account.pk == obj.id)
        except:
            return False


class IsBuyerAccountOwnerOrReadOnly(IsBuyerAccountOwner):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_object_permission(request, view, obj)
