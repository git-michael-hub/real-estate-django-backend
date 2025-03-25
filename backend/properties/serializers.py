from rest_framework import serializers, exceptions

from sellers.models import SellerAccount
from sellers.serializers import SellerAccountListSerializer, SellerAccountRetrieveSerializer

from .models import Property, PROPERTY_TYPE, PROPERTY_STATUS


class PropertyListSerializer(serializers.ModelSerializer):
    seller_account = SellerAccountListSerializer()
    property_type_display = serializers.SerializerMethodField()

    class Meta:
        model = Property
        exclude = ['is_deleted']

    def get_property_type_display(self, obj):
        return obj.get_property_type_display()


class PropertyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        exclude = ['seller_account', 'is_deleted']

    def property_type_err_str(self, field_name):
        return f"Only property_type 'House and Lot' and 'Condomimium' can have a '{field_name}' attribute."

    def validate(self, attrs):
        property_type = attrs.get('property_type')

        # Checks if data with property_type 'RL' or 'CL' contains the following fields:
        # ['bathrooms', 'bedrooms', 'floor_area', 'num_of_floor'].
        # Raises validation error if it contains one.
        if property_type in [PROPERTY_TYPE.RESIDENTAIL_LOT, PROPERTY_TYPE.COMMERCIAL_LOT]:
            for field_name in ['bathrooms', 'bedrooms', 'floor_area', 'num_of_floors']:
                if attrs.get(field_name):
                    raise serializers.ValidationError(
                        self.property_type_err_str(field_name))

        # Checks if data with property_type 'CO' contains 'lot_area'.
        # Raises validation error if it has.
        if property_type == PROPERTY_TYPE.CONDOMINIUM and attrs.get('lot_area'):
            raise serializers.ValidationError(
                self.property_type_err_str(field_name))

        return attrs

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


class PropertyRetreiveSerializer(PropertyListSerializer):
    seller_account = SellerAccountRetrieveSerializer()
    listings = serializers.SerializerMethodField()

    class Meta(PropertyListSerializer.Meta):
        exclude = PropertyListSerializer.Meta.exclude

    def get_listings(self, obj):
        from listings.serializers import ListingListSerializer
        listings = obj.listings.all()
        return ListingListSerializer(listings, many=True).data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        user = self.context['request'].user

        # only show listing if the user is the owner of the property
        if user.seller_account != instance.seller_account:
            data.pop('listings')

        return data


class PropertyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        exclude = ['seller_account', 'date_created', 'is_deleted']

    def validate(self, attrs):
        if self.instance.status == PROPERTY_STATUS.LISTED:
            for field in attrs.keys():
                if field not in Property.EDITABLE_FIELDS['after_listing']:
                    raise serializers.ValidationError(
                        f"Field '{field}' is not editable when property is listed.")

        if self.instance.status in [PROPERTY_STATUS.OFFER_ACCEPTED, PROPERTY_STATUS.SOLD]:
            raise serializers.ValidationError(
                f"Property with status '{PROPERTY_STATUS.CHOICES[self.instance.status][1]}' is not editable.")

        return attrs
