from django.contrib.auth.hashers import make_password

from rest_framework import serializers

from user.serializers import UserDetailSerializer

from .models import BuyerAccount, BuyerVerificationRequest


class BuyerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerAccount
        fields = ['first_name', 'last_name']


class BuyerVerificationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerVerificationRequest
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            'pin_code': {'write_only': True}
        }

    def create(self, validated_data):
        email = validated_data['email']
        existing_buyer_verification_request = BuyerVerificationRequest.objects.filter(
            email=email).first()
        if existing_buyer_verification_request:
            existing_buyer_verification_request.delete()

        password = validated_data['password']
        validated_data['password'] = make_password(password)
        return super(BuyerVerificationRequestSerializer, self).create(validated_data)


class BuyerVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    pin_code = serializers.IntegerField()

    def validate(self, attrs):
        email = attrs.get('email')
        pin_code = attrs.get('pin_code')
        existing_buyer_verification_request = BuyerVerificationRequest.objects.filter(
            email=email, pin_code=pin_code).first()
        if existing_buyer_verification_request:
            return attrs
        raise serializers.ValidationError('Invalid PIN code.')


class BuyerAccountDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerAccount
        fields = '__all__'


class BuyerDetailSerializer(BuyerAccountDetailSerializer):
    user = UserDetailSerializer()

    class Meta(BuyerAccountDetailSerializer.Meta):
        fields = BuyerAccountDetailSerializer.Meta.fields
