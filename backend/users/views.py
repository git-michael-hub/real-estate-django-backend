from random import randint

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail

from rest_framework import generics, authentication, status, permissions
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response

from config.settings import CORS_ALLOWED_ORIGINS, EMAIL_HOST_USER

from buyers.models import BuyerAccount
from sellers.models import SellerAccount

from .models import PasswordResetRequest, User
from .serializers import UserCreateSerializer, UserEmailVerificationSerializer, ResetPasswordSerializer, UserDetailSerializer, PasswordResetRequestSerializer


class UserCreateView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        pin_code = randint(100000, 999999)

        user = User(email=data['email'],
                    username=data['username'],
                    password=make_password(data['password']),
                    is_active=False,
                    email_verification_pin=pin_code
                    )
        user.save()

        buyer_account = BuyerAccount(user=user)
        buyer_account.save()

        seller_account = SellerAccount(user=user)
        seller_account.save()

        send_mail(
            "Real Estate System: Email Verification.",
            f"Your 6-digit One-Time-PIN is: {pin_code}",
            EMAIL_HOST_USER,
            [data['email']],
            fail_silently=False,
            html_message=f"<p>Your 6-digit One-Time-PIN is: {pin_code}</p>"
        )

        return Response({'success': ['Registration complete!']}, status=status.HTTP_201_CREATED)


user_create_view = UserCreateView.as_view()


class UserEmailVerificationView(generics.UpdateAPIView):
    serializer_class = UserEmailVerificationSerializer
    queryset = User.objects.all()
    lookup_field = 'email'

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.get_object()
        user.email_verification_pin = None
        user.is_active = True
        user.save()
        return Response({'success': ['Your email has been verified.']}, status=status.HTTP_200_OK)


user_email_verification_view = UserEmailVerificationView.as_view()


class UserLoginView(ObtainAuthToken):
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user_data = UserDetailSerializer(user)
        return Response({'token': token.key, 'user': user_data.data})


user_login_view = UserLoginView.as_view()


class UserDetailView(generics.GenericAPIView):
    serializer_class = UserDetailSerializer
    authentication_classes = [authentication.TokenAuthentication]

    def get(self, request):
        user = Token.objects.get(key=request.auth).user
        serializer = self.get_serializer(user)
        return Response(serializer.data)


user_detail_view = UserDetailView.as_view()


class UserLogoutView(generics.GenericAPIView):
    authentication_classes = [authentication.TokenAuthentication]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'success': ['Logout successful.']})


user_logout_view = UserLogoutView.as_view()


class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        token = PasswordResetTokenGenerator().make_token(user)
        reset_request = PasswordResetRequest(email=email, token=token)
        reset_request.save()
        reset_url = f"{CORS_ALLOWED_ORIGINS[0]}/password-reset/{token}"
        send_mail(
            "Real Estate System: Request for password reset.",
            f"Copy and paste the provided link to reset your password {reset_url}",
            EMAIL_HOST_USER,
            [email],
            fail_silently=False,
            html_message=f"<p>Click the provided link to reset your password <a href={reset_url}>{reset_url}</a></p>"
        )

        return Response({'success': ['We have sent you a link to reset your password']}, status=status.HTTP_200_OK)


request_password_reset = PasswordResetRequestView.as_view()


class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer

    def post(self, request, token):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reset_request = PasswordResetRequest.objects.filter(
            token=token).first()
        new_password = serializer.validated_data['new_password']

        user = User.objects.filter(email=reset_request.email).first()
        user.set_password(new_password)
        user.save()
        reset_request.delete()

        return Response({'success': ['Password updated']}, status=status.HTTP_200_OK)


password_reset = ResetPasswordView.as_view()


# class UserEmailLoginView(ObtainAuthToken):
#     serializer_class = UserEmailLoginSerializer

#     def post(self, request):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({'token': token.key})
