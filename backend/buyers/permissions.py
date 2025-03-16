from users.permissions import IsAccountOwner, IsAccountOwnerOrReadOnly


class IsBuyerAccountOwner(IsAccountOwner):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.buyer_account.pk == obj.pk)


class IsBuyerAccountOwnerOrReadOnly(IsAccountOwnerOrReadOnly, IsBuyerAccountOwner):
    pass
