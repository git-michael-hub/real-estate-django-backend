from users.permissions import IsAccountOwner, IsAccountOwnerOrReadOnly


class IsAgentAccountOwner(IsAccountOwner):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.agent_account.pk == obj.pk)


class IsAgentAccountOwnerOrReadOnly(IsAccountOwnerOrReadOnly, IsAgentAccountOwner):
    pass


class IsAgentApplicationOwner(IsAccountOwner):
    def has_object_permission(self, request, view, obj):
        return (request.user.is_authenticated and
                request.user.agent_account.pk == obj.agent_account.pk)
