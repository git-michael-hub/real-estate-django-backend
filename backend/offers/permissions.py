from rest_framework import permissions


class IsOfferBuyer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        username = view.kwargs.get('username')
        return (request.user.is_authenticated and
                request.user.username == username and
                request.user.buyer_account == obj.buyer_account)


class IsOfferSeller(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        username = view.kwargs.get('username')
        return (request.user.is_authenticated and
                request.user.username == username and
                request.user.seller_account == obj.seller_account)


class IsOfferAgent(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        username = view.kwargs.get('username')
        return (request.user.is_authenticated and
                request.user.username == username and
                request.user.agent_account == obj.agent_account)
