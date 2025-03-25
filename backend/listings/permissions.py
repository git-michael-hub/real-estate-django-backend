from rest_framework import permissions


class IsListingPropertySeller(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.seller_account == obj.property.seller_account)


class IsListingAgent(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.agent_account == obj.agent_account)
