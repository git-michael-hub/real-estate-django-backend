from users.permissions import IsAccountOwner, IsAccountOwnerOrReadOnly


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
