from rest_framework import permissions


class IsRecipient(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(request.user == obj.recipient)

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True

        return bool(request.user.username == view.kwargs['recipient_username'])
