from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        username = view.kwargs.get('username')
        try:
            return bool(request.user.username == username)
        except:
            return False

    def has_object_permission(self, request, view, obj):
        try:
            return bool(request.user.seller_account.pk == obj.seller_account.pk)
        except:
            return False
