from rest_framework import serializers, status

from .models import SellerApplication, SellerAccount


class SellerApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerApplication
        fields = ['business_name', 'business_address']

    def validate(self, attrs):
        user = self.context['request'].user
        if user.seller_account.is_active:
            raise serializers.ValidationError(
                'Account already have active seller_account.', status.HTTP_400_BAD_REQUEST)
        return attrs


class SellerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerApplication
        fields = '__all__'


class SellerAccountDetailUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerAccount
        fields = ['user', 'business_name', 'business_address', 'contact_number_1', 'contact_number_2',
                  'description', 'profile_image_path', 'date_approved']
        read_only_fields = ['user', 'date_approved', 'is_approved']


class SellerAccountPartialDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = SellerAccount
        fields = ['user', 'business_name',
                  'business_address', 'description', 'profile_image_path']
