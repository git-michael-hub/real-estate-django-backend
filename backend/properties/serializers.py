from rest_framework import serializers, exceptions

from sellers.models import SellerAccount
from sellers.serializers import SellerAccountListSerializer, SellerAccountRetrieveSerializer

from .models import Property


class PropertyListSerializer(serializers.ModelSerializer):
    seller_account_details = SellerAccountListSerializer(
        source='seller_account', read_only=True)

    class Meta:
        model = Property
        exclude = ['is_deleted']


class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        exclude = ['seller_account', 'is_deleted']

    def create(self, validated_data):
        seller_account = self.context['request'].user.seller_account
        image1_path = validated_data.pop('image1_path', None)
        image2_path = validated_data.pop('image2_path', None)
        image3_path = validated_data.pop('image3_path', None)
        image4_path = validated_data.pop('image4_path', None)
        image5_path = validated_data.pop('image5_path', None)

        validated_data['seller_account'] = SellerAccount.objects.get(
            pk=seller_account.pk)
        property = Property.objects.create(**validated_data)

        if image1_path:
            property.image1_path = image1_path
        if image2_path:
            property.image2_path = image2_path
        if image3_path:
            property.image3_path = image3_path
        if image4_path:
            property.image4_path = image4_path
        if image5_path:
            property.image5_path = image5_path

        property.save()
        return property


class PropertyRetreiveSerializer(serializers.ModelSerializer):
    seller_account_details = SellerAccountRetrieveSerializer(
        source='seller_account')

    class Meta:
        model = Property
        exclude = ['is_deleted']


class PropertyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        exclude = ['seller_account', 'date_created', 'is_deleted']

    def validate(self, attrs):
        if self.instance.has_listings():
            for field in attrs.keys():
                if field not in Property.EDITABLE_FIELDS['after_listing']:
                    raise exceptions.PermissionDenied(
                        'Data contains fields that is not editable.')
        return attrs
