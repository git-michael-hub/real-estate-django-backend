from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from rest_framework import generics, status, permissions
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response

from config import settings

from .models import PasswordResetRequest, User
from .serializers import (
    UserCreateSerializer,
    UserEmailVerificationSerializer,
    AuthUserRetrieveSerializer,
    ResetPasswordSerializer,
    PasswordResetRequestSerializer
)


class UserCreateView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        email_subject = "Real Estate System: Email Verification."
        email_message = f"Your 6-digit One-Time-PIN is: {user.email_verification_pin}"
        email_html_message = f"<p>Your 6-digit One-Time-PIN is: {user.email_verification_pin}</p>"

        send_mail(
            email_subject,
            email_message,
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
            html_message=email_html_message
        )


class UserEmailVerificationView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserEmailVerificationSerializer
    lookup_field = 'email'


class UserLoginView(ObtainAuthToken):
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = AuthUserRetrieveSerializer(user)
        return Response({'token': token.key, 'user': user_serializer.data}, status=status.HTTP_200_OK)


class UserRetrieveView(generics.RetrieveAPIView):
    serializer_class = AuthUserRetrieveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = Token.objects.get(key=self.request.auth).user
        return user


class UserLogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'success': ['Logout successful.']}, status=status.HTTP_200_OK)


class PasswordResetRequestView(generics.CreateAPIView):
    serializer_class = PasswordResetRequestSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        reset_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/reset-password/{instance.token}"
        email_subject = "Real Estate System: Request for password reset."
        email_message = f"Copy and paste the provided link to reset your password {reset_url}"
        email_html_message = f"<a href={reset_url}>Click the provided link to reset your password.</a>"

        send_mail(
            email_subject,
            email_message,
            settings.EMAIL_HOST_USER,
            [instance.user.email],
            fail_silently=False,
            html_message=email_html_message
        )


class ResetPasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ResetPasswordSerializer

    def get_object(self):
        token = self.kwargs.get('token')
        obj = get_object_or_404(self.get_queryset(),
                                password_reset_requests__token=token)
        return obj

    def perform_update(self, serializer):
        user = serializer.save()
        PasswordResetRequest.objects.filter(user=user).delete()


# class UserEmailLoginView(ObtainAuthToken):
#     serializer_class = UserEmailLoginSerializer

#     def post(self, request):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({'token': token.key})
