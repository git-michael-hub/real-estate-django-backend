from rest_framework import permissions

from properties.models import Property


class IsPropertyAgentAssignmentOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        username = view.kwargs.get('username')
        property_pk = view.kwargs.get('property_pk')
        property_instance = Property.objects.get(pk=property_pk)
        return (request.user.is_authenticated and
                request.user.is_seller() and
                request.user.username == username and
                request.user.seller_account == property_instance.seller_account)

    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.seller_account == obj.property.seller_account)


class IsPropertyAgentAssignedAgent(permissions.BasePermission):
    def has_permission(self, request, view):
        username = view.kwargs.get('username')
        return (request.user.is_authenticated and
                request.user.is_agent() and
                request.user.username == username)

    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.agent_account == obj.agent)
