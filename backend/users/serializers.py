from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import User


class UserCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(), message='Email already exists.')]
    )

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'first_name', 'last_name']

    def validate_password(self, password):
        confirm_password = self.context['request'].POST.get('confirm_password')
        if (password != confirm_password):
            raise serializers.ValidationError("Password does not match.")
        return password

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserCreateSerializer, self).create(validated_data)


class UserEmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email_verification_pin']

    def validate(self, attrs):
        email = self.context['view'].kwargs['email']
        pin_code = attrs.get('email_verification_pin')
        user = User.objects.get(email=email)

        if user is None:
            raise serializers.ValidationError(
                'User with email does not exist.')

        if user.is_active == True:
            raise serializers.ValidationError(
                'User email is already verified.')

        if user.email_verification_pin != pin_code:
            raise serializers.ValidationError(
                'PIN does not match.')

        return attrs


# CREATE TEST FOR THIS
class UserEmailLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = User.objects.get(email=email)

        if user is not None:
            username = user.username
        else:
            msg = _('Unable to log in with provided credentials.')
            raise serializers.ValidationError(msg, code='authorization')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)

            # The authenticate call simply returns None for is_active=False
            # users. (Assuming the default ModelBackend authentication
            # backend.)
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "username" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class UserDetailSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'roles']
        read_only_fields = ['username', 'email', 'id', 'roles']

    def get_roles(self, obj):
        roles = []
        try:
            if (obj.buyer_account):
                roles.append('buyer')
            if (obj.seller_account):
                roles.append('seller')
        except:
            pass
        return roles


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.RegexField(
        regex=r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
        write_only=True,
        error_messages={'invalid': (
            'Password must be at least 8 characters long with at least one capital letter and symbol')}
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError('Password does not match')
        return data
