from rest_framework import serializers

from .models import Listing

from users.serializers import UserDetailSerializer
from sellers.serializers import SellerAccountListSerializer


class ListingSerializer(serializers.ModelSerializer):

    listing_type_display = serializers.SerializerMethodField()
    property_type_display = serializers.SerializerMethodField()
    seller = SellerAccountListSerializer()

    class Meta:
        model = Listing
        fields = '__all__'

    def validate(self, data):
        property_type = data.get('property_type')
        bedrooms = data.get('bedrooms')
        bathrooms = data.get('bathrooms')
        if (property_type != 'CO' and property_type != 'HL'):
            if (bedrooms != None):
                raise serializers.ValidationError(
                    "Only property_type 'House and Lot' and 'Condominuim' can contain value in 'bedrooms' field.")
            if (bathrooms != None):
                raise serializers.ValidationError(
                    "Only property_type 'House and Lot' and 'Condominuim' can contain value in 'bathrooms' field.")
        return data

    def get_listing_type_display(self, obj):
        return obj.get_listing_type_display()

    def get_property_type_display(self, obj):
        return obj.get_property_type_display()

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None


class ListingDetailSerializer(ListingSerializer):
    seller = UserDetailSerializer()

    class Meta(ListingSerializer.Meta):
        fields = ListingSerializer.Meta.fields
        read_only_fields = ['seller']


class ListingQuerySerializer(serializers.Serializer):
    username = serializers.CharField(max_length=100, required=False)
    listing_type = serializers.ChoiceField(
        choices=Listing.LISTING_TYPES, required=False)
    property_type = serializers.ChoiceField(
        choices=Listing.PROPERTY_TYPES, required=False)
    province = serializers.CharField(max_length=100, required=False)
    city = serializers.CharField(max_length=100, required=False)
    min_price = serializers.IntegerField(required=False)
    max_price = serializers.IntegerField(required=False)
    min_area = serializers.IntegerField(required=False)
    max_area = serializers.IntegerField(required=False)

    def validate(self, data):
        max_price = data.get('max_price')
        min_price = data.get('min_price')
        if min_price and max_price and min_price > max_price:
            raise serializers.ValidationError(
                "Max Price should be greater than or equal to Min Price.")

        max_area = data.get('max_area')
        min_area = data.get('min_area')
        if min_area and max_area and min_area > max_area:
            raise serializers.ValidationError(
                "Max Area should be greater than or equal to Min Area.")

        return data
