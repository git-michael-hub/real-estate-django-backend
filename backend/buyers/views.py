from random import randint

from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import QueryDict

from config.settings import EMAIL_HOST_USER

from user.serializers import UserCreateSerializer

from .models import BuyerVerificationRequest, BuyerAccount
from .serializers import BuyerCreateSerializer, BuyerVerificationRequestSerializer, BuyerVerificationSerializer, BuyerDetailSerializer
from .permissions import IsBuyerAccountOwnerOrReadOnly


class BuyerVerificationView(generics.CreateAPIView):

    def create(self, request):
        user_serializer = UserCreateSerializer(
            data=request.data, context={'request': request})
        buyer_serializer = BuyerCreateSerializer(data=request.data)

        user_serializer.is_valid(raise_exception=True)
        buyer_serializer.is_valid(raise_exception=True)

        pin_code = randint(100000, 999999)

        if isinstance(request.data, QueryDict):
            request.data._mutable = True

        request.data["pin_code"] = pin_code

        serializer = BuyerVerificationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        email = serializer.validated_data['email']
        send_mail(
            "Real Estate System: Email Verification.",
            f"Your 6-digit One-Time-PIN is: {pin_code}",
            EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


buyer_verification_view = BuyerVerificationView.as_view()


class BuyerCreateView(generics.CreateAPIView):
    def create(self, request):
        serializer = BuyerVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        buyer_verification_request = BuyerVerificationRequest.objects.filter(
            email=data['email'], pin_code=data['pin_code'])[0]

        user = User(email=buyer_verification_request.email,
                    username=buyer_verification_request.username,
                    password=buyer_verification_request.password)
        user.save()

        buyer_account = BuyerAccount(
            user=user,
            first_name=buyer_verification_request.first_name,
            last_name=buyer_verification_request.last_name)
        buyer_account.save()

        buyer_verification_request.delete()

        return Response({'success': ['Registration complete!']}, status=status.HTTP_201_CREATED)


buyer_create_view = BuyerCreateView.as_view()


class BuyerDetailUpdateView(generics.RetrieveUpdateAPIView):
    queryset = BuyerAccount
    serializer_class = BuyerDetailSerializer
    permission_classes = [IsBuyerAccountOwnerOrReadOnly]
    lookup_field = 'username'

    def get_object(self):
        obj = get_object_or_404(
            self.get_queryset(), user__username=self.kwargs.get('username'))
        self.check_object_permissions(self.request, obj)
        return obj


buyer_detail_update_view = BuyerDetailUpdateView.as_view()
