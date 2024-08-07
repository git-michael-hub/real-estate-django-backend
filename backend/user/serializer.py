from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'email',
            'first_name',
            'last_name'
        ]

    def validate_password(self, value):
        confirm_password = self.context['request'].POST.get('confirm_password')
        if (value != confirm_password):
            raise serializers.ValidationError("Password does not match.")
        return value
