from rest_framework import permissions


class IsAgentAccountOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        try:
            return bool(request.user.agent_account.pk == obj.pk)
        except:
            return False
