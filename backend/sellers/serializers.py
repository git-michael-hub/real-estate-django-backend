from django.db import transaction
from django.utils import timezone

from rest_framework import serializers

from users.serializers import UserRetrieveSerializer

from .models import SellerApplication, SellerAccount, SELLER_APP_STATUS


class SellerApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerApplication
        fields = ['business_name', 'business_address']

    def validate(self, attrs):
        user = self.context['request'].user
        if user.seller_account.is_active:
            raise serializers.ValidationError(
                'Account already have active Seller account.')

        return attrs

    def create(self, validated_data):
        with transaction.atomic():
            seller_account = self.context['request'].user.seller_account
            seller_account.cancel_active_applications()
            seller_application = SellerApplication.objects.create(
                seller_account=seller_account, **validated_data)

        return seller_application


class SellerApplicationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerApplication
        fields = ['id', 'business_name', 'status', 'application_date']


class SellerApplicationRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerApplication
        fields = '__all__'


class SellerApplicationCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerApplication
        fields = ['status']

    def validate(self, attrs):
        if attrs.get('status') != SELLER_APP_STATUS.CANCELLED:
            raise serializers.ValidationError('Invalid data.')

        return attrs

    def update(self, instance, validated_data):
        instance.is_active = False
        instance.status = SELLER_APP_STATUS.CANCELLED
        instance.date_reviewed = timezone.now()
        instance.save()
        return instance


class SellerAccountUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerAccount
        fields = ['business_name', 'business_address', 'contact_number_1',
                  'contact_number_2', 'profile_image_path', 'description']


class SellerAccountRetrieveSerializer(serializers.ModelSerializer):
    user = UserRetrieveSerializer()

    class Meta:
        model = SellerAccount
        fields = '__all__'


class SellerAccountListSerializer(serializers.ModelSerializer):
    user = UserRetrieveSerializer()

    class Meta:
        model = SellerAccount
        fields = ['user', 'business_name',
                  'business_address', 'description', 'profile_image_path']
