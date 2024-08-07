from rest_framework import generics
from django.contrib.auth.models import User


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
