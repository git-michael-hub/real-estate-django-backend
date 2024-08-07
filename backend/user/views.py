from rest_framework import generics
from django.contrib.auth.models import User
from .serializer import UserSerializer


class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
