from random import randint

from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db import transaction

from rest_framework import serializers

from agents.models import AgentAccount
from buyers.models import BuyerAccount
from sellers.models import SellerAccount

from .models import User, PasswordResetRequest


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.RegexField(
        regex=r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
        required=True,
        write_only=True,
        error_messages={'invalid': (
            'Password must be at least 8 characters long with at least one capital letter and symbol')}
    )
    confirm_password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password',
                  'confirm_password', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError("Password does not match.")

        attrs.pop('confirm_password')
        return attrs

    def create(self, validated_data):
        pin_code = randint(100000, 999999)

        with transaction.atomic():
            user = User.objects.create_user(is_active=False,
                                            email_verification_pin=pin_code,
                                            **validated_data)
            BuyerAccount.objects.create(user=user)
            SellerAccount.objects.create(user=user)
            AgentAccount.objects.create(user=user)

        return user


class UserEmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email_verification_pin']
        extra_kwargs = {'email_verification_pin': {'required': True}}

    def validate(self, attrs):
        email = self.context['view'].kwargs['email']
        user = User.objects.filter(email=email).first()
        pin_code = attrs.get('email_verification_pin')

        if not user:
            raise serializers.ValidationError(
                'User with email does not exist.')

        if user.is_active == True:
            raise serializers.ValidationError(
                'User email is already verified.')

        if user.email_verification_pin != pin_code:
            raise serializers.ValidationError(
                'PIN does not match.')

        return attrs

    def update(self, instance, validated_data):
        instance.email_verification_pin = None
        instance.is_active = True
        instance.save()
        return instance


# CREATE TEST FOR THIS
class UserEmailLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = User.objects.filter(email=email).first()

        if not user:
            raise serializers.ValidationError(
                'Unable to log in with provided credentials.')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                                username=user.username,
                                password=password)
            if not user:
                raise serializers.ValidationError(
                    'Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError(
                'Must include "username" and "password" or "email" and "password".')

        attrs['user'] = user
        return attrs


class AuthUserRetrieveSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'roles']

    def get_roles(self, instance):
        roles = ['buyer']
        if instance.is_seller:
            roles.append('seller')
        if instance.is_agent:
            roles.append('agent')
        return roles


class UserRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'first_name', 'last_name', 'date_joined']


class PasswordResetRequestSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, write_only=True)

    class Meta:
        model = PasswordResetRequest
        fields = ['email']

    def validate(self, attrs):
        """
        Ensures that a user exists for the given email.
        """
        user = User.objects.filter(email=attrs.pop('email')).first()
        if not user:
            raise serializers.ValidationError(
                'User with credentials not found')

        attrs['user'] = user
        return attrs

    def create(self, validated_data):
        """
        - Deletes any existing request for the user.
        - Generates a secure token.
        - Creates a new password reset request
        - Returns the new request object.
        """
        with transaction.atomic():
            user = validated_data['user']
            PasswordResetRequest.objects.filter(user=user).delete()
            token = PasswordResetTokenGenerator().make_token(user)
            reset_request = PasswordResetRequest.objects.create(
                user=user, token=token)

        return reset_request


class ResetPasswordSerializer(serializers.ModelSerializer):
    password = serializers.RegexField(
        regex=r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
        required=True,
        write_only=True,
        error_messages={'invalid': (
            'Password must be at least 8 characters long with at least one capital letter and symbol')}
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['password', 'confirm_password']

    def validate(self, attrs):
        # Check if password matches.
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError(
                'Password does not match')

        token = self.context['view'].kwargs['token']
        reset_request = PasswordResetRequest.objects.filter(
            token=token).first()

        # Check if token is valid by checking if reset_request exists
        if not reset_request:
            raise serializers.ValidationError(
                'Invalid token')

        return attrs

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance
