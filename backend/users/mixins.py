from random import randint

from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404

from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.request import QueryDict

from config.settings import EMAIL_HOST_USER

from .serializers import UserCreateSerializer


class CreateEmailValidationRequestMixin:
    def create(self, request):
        user_serializer = UserCreateSerializer(
            data=request.data, context={'request': request})
        user_serializer.is_valid(raise_exception=True)

        if isinstance(request.data, QueryDict):
            request.data._mutable = True

        password = make_password(request.data['password'])
        pin_code = randint(100000, 999999)

        request.data["password"] = password
        request.data["pin_code"] = pin_code

        serializer = self.get_serializer(data=request.data)
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


class CreateEmailValidationRequestSerializerMixin:
    def create(self, validated_data):
        email = validated_data['email']
        existing_validation_request = self.Meta.model.objects.filter(
            email=email).first()
        if existing_validation_request:
            existing_validation_request.delete()

        return super().create(validated_data)


class ValidatePinCodeSerializerMixin:
    def validate(self, attrs):
        email = attrs.get('email')
        pin_code = attrs.get('pin_code')
        existing_validation_request = self.Meta.model.objects.filter(
            email=email, pin_code=pin_code).first()
        if existing_validation_request:
            return attrs
        raise serializers.ValidationError('Invalid PIN code.')


class RetrieveByUsernameMixin:
    def get_object(self, *args, **kwargs):
        obj = get_object_or_404(
            self.get_queryset(), user__username=self.kwargs.get('username'))
        self.check_object_permissions(self.request, obj)
        return obj
