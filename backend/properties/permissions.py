from users.permissions import IsAccountOwner


class IsPropertyOwner(IsAccountOwner):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.seller_account.pk == obj.seller_account.pk)
