from rest_framework import permissions


class IsTransactionBuyer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        username = view.kwargs.get('username')
        return (request.user.is_authenticated and
                request.user.username == username and
                obj.offer.buyer_account == request.user.buyer_account)


class IsTransactionSeller(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        username = view.kwargs.get('username')
        return (request.user.is_authenticated and
                request.user.username == username and
                obj.offer.seller_account == request.user.seller_account)


class IsTransactionAgent(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        username = view.kwargs.get('username')
        return (request.user.is_authenticated and
                request.user.username == username and
                obj.offer.agent_account == request.user.agent_account)
