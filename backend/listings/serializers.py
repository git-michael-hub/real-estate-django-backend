from rest_framework import serializers
from .models import Listing, property_types, listing_types


class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            'owner',
            'title',
            'listing_type',
            'property_type',
            'price',
            'image',
            'property_size',
            'description',
            'is_available',

            # Only for House and Lot and Condominuim property types
            'bedrooms',
            'bathrooms',

            # For listing location
            'province',
            'city',
            'baranggay',
            'street',
        ]


class ListingQuerySerializer(serializers.Serializer):
    listing_type = serializers.ChoiceField(choices=listing_types)
    property_type = serializers.ChoiceField(choices=property_types)
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
