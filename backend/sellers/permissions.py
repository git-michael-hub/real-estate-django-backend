from rest_framework import permissions

from users.permissions import IsAccountOwner, IsAccountOwnerOrReadOnly


class IsSeller(permissions.BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_authenticated and
                request.user.is_seller())


class IsSellerAccountOwner(IsAccountOwner):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.seller_account.pk == obj.pk)


class IsSellerAccountOwnerOrReadOnly(IsAccountOwnerOrReadOnly, IsSellerAccountOwner):
    pass


class IsSellerApplicationOwner(IsAccountOwner):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.seller_account.pk == obj.seller_account.pk)
