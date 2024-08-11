from django.contrib.auth.models import User
from rest_framework import generics, authentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})

        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'user_id': user.pk,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name}

        })


user_login_view = CustomAuthToken.as_view()


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


user_list_view = UserListView.as_view()


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


user_create_view = UserCreateView.as_view()


class UserDetailView(generics.RetrieveAPIView):
    lookup_field = 'pk'
    queryset = User.objects.all()
    serializer_class = UserSerializer


user_detail_view = UserDetailView.as_view()


class UserLogoutView(APIView):

    authentication_classes = [authentication.TokenAuthentication]

    def post(self, request, format=None):
        request.user.auth.token.delete()
        return Response({'success_message': ['Logout successful.']})
