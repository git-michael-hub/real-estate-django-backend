
from django.shortcuts import get_object_or_404


class RetrieveByUsernameMixin:
    """
    Use mixin to retrieve object using username in the URL. 
    Object must have a 'user' field and URL must have 'username'. 
    """

    def get_object(self, *args, **kwargs):
        username = self.kwargs.get('username')
        if not username:
            raise ValueError("Username is required in URL parameters.")

        queryset = self.get_queryset()
        if not queryset:
            raise AttributeError("get_queryset() must be implemented in view.")

        obj = get_object_or_404(queryset, user__username=username)
        self.check_object_permissions(self.request, obj)

        return obj
