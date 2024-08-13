from django.core.mail import send_mail

from config import settings

from .serializers import ResetPasswordSerializer
import os
import config
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework import generics, authentication, status, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PasswordReset
from .serializers import UserSerializer, ResetPasswordRequestSerializer


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
    authentication_classes = [authentication.TokenAuthentication]


user_list_view = UserListView.as_view()


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


user_create_view = UserCreateView.as_view()


class UserDetailView(APIView):

    authentication_classes = [authentication.TokenAuthentication]

    def get(self, request):
        user = Token.objects.get(key=request.auth).user
        serializer = UserSerializer(user)
        return Response(serializer.data)


user_detail_view = UserDetailView.as_view()


class UserLogoutView(APIView):

    authentication_classes = [authentication.TokenAuthentication]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'success_message': ['Logout successful.']})


user_logout_view = UserLogoutView.as_view()


class RequestPasswordReset(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ResetPasswordRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        email = data['email']
        user = User.objects.filter(email__iexact=email).first()

        if user:
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            reset = PasswordReset(email=email, token=token)
            reset.save()
            reset_url = f"http://localhost:5173/password-reset/{token}"

            send_mail(
                "Real Estate System: Request for password reset.",
                reset_url,
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User with credentials not found"}, status=status.HTTP_404_NOT_FOUND)


request_password_reset = RequestPasswordReset.as_view()


class ResetPassword(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = []

    def post(self, request, token):
        print(token)
        serializer = self.serializer_class(data=request.data)

        print(serializer)

        serializer.is_valid(raise_exception=True)
        print('valid')
        data = serializer.validated_data
        new_password = data['new_password']
        reset_obj = PasswordReset.objects.filter(token=token).first()

        if not reset_obj:
            return Response({'generic_message': ['Invalid token']}, status=400)

        user = User.objects.filter(email=reset_obj.email).first()

        if user:
            user.set_password(new_password)
            user.save()
            reset_obj.delete()

            return Response({'success_message': ['Password updated']})
        else:
            return Response({'generic_message': ['No user found']}, status=404)


password_reset = ResetPassword.as_view()
