from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Roles, EmailVerificationRequest


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(), message='Email already exists.')]
    )

    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'email',
            'first_name',
            'last_name'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_password(self, value):
        confirm_password = self.context['request'].POST.get('confirm_password')
        if (value != confirm_password):
            raise serializers.ValidationError("Password does not match.")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)


class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = [
            'is_buyer',
            'is_seller',
            'is_agent'
        ]


class UserDetailSerializer(serializers.ModelSerializer):
    roles = RolesSerializer(read_only=True, source='user_roles')

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'roles'
        ]


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


class EmailVerificationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailVerificationRequest
        fields = ['email', 'pin']
