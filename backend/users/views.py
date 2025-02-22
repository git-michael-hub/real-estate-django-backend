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
from .serializers import UserCreateSerializer, UserEmailVerificationSerializer, ResetPasswordSerializer,  UserEmailLoginSerializer, UserDetailSerializer, EmailSerializer


class UserCreateView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        password = request.data['password']
        pin_code = randint(100000, 999999)

        user = User(email=data['email'],
                    username=data['username'],
                    password=make_password(password),
                    is_active=False,
                    email_verification_pin=pin_code
                    )
        user.save()

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

    def patch(self, request, email):
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
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # VALIDATE DATA
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # PROCESS DATA AND CHECK IF USER EXISTS
        data = serializer.validated_data
        email = data['email']
        user = User.objects.filter(email=email).first()
        if user:

            # CHECK IF THERE IS ALREADY AN EXISTING REQUEST FROM USER
            # IF REQUEST ALREADY EXIST, DELETE REQUEST
            existing_reset_request = PasswordResetRequest.objects.filter(
                email=email).first()
            if existing_reset_request:
                existing_reset_request.delete()

            # GENERATE TOKEN >> CREATE NEW REQUEST >> CREATE RESET LINK >> SEND LINK TO USER'S EMAIL
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
        else:
            return Response({"error": ["User with credentials not found"]}, status=status.HTTP_404_NOT_FOUND)


request_password_reset = PasswordResetRequestView.as_view()


class ResetPasswordView(generics.GenericAPIView):

    def post(self, request, token):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        new_password = data['new_password']

        # CHECK IF TOKEN IS VALID BY CHECKING IF RESET REQUEST EXISTS
        reset_request = PasswordResetRequest.objects.filter(
            token=token).first()
        if not reset_request:
            return Response({'error': ['Invalid token']}, status=status.HTTP_400_BAD_REQUEST)

        # CHECK IF USER EXISTS >> SET AND SAVE NEW PASSWORD >> DELETE COMPLETED RESET REQUEST
        user = User.objects.filter(email=reset_request.email).first()
        if user:
            user.set_password(new_password)
            user.save()
            reset_request.delete()

            return Response({'success': ['Password updated']}, status=status.HTTP_200_OK)
        else:
            return Response({'error': ['No user found']}, status=status.HTTP_404_NOT_FOUND)


password_reset = ResetPasswordView.as_view()


# class UserEmailLoginView(ObtainAuthToken):
#     serializer_class = UserEmailLoginSerializer

#     def post(self, request):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({'token': token.key})
