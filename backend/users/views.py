from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail

from rest_framework import generics, authentication, status, permissions
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response


from config.settings import CORS_ALLOWED_ORIGINS, EMAIL_HOST_USER

from .models import PasswordResetRequest
from .serializers import EmailSerializer, ResetPasswordSerializer,  UserEmailLoginSerializer, UserDetailSerializer


class UserLoginView(ObtainAuthToken):
    def post(self, request):
        serializer = self.get_serializer(data=request.data,
                                         context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user_data = UserDetailSerializer(user)
        return Response({'token': token.key, 'user': user_data.data})


user_login_view = UserLoginView.as_view()


class UserEmailLoginView(ObtainAuthToken):
    def post(self, request):
        serializer = UserEmailLoginSerializer(
            data=request.data, context={'request', request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})


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
            reset_url = f"Click the provided link to reset your password {CORS_ALLOWED_ORIGINS[0]}/password-reset/{token}"
            send_mail(
                "Real Estate System: Request for password reset.",
                reset_url,
                EMAIL_HOST_USER,
                [email],
                fail_silently=False,
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


############ DEVELOPMENT ONLY ####################


# class UserListView(generics.ListAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserDetailSerializer
#     authentication_classes = [authentication.TokenAuthentication]


# user_list_view = UserListView.as_view()