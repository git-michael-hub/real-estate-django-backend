
from django.shortcuts import get_object_or_404


class RetrieveByUsernameMixin:
    """
    Use mixin to retrieve object using username. 
    Object must have a 'user' field. 
    """

    def get_object(self, *args, **kwargs):
        obj = get_object_or_404(
            self.get_queryset(), user__username=self.kwargs.get('username'))
        self.check_object_permissions(self.request, obj)
        return obj
