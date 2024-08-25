from rest_framework import serializers
from .models import Listing


class ListingCreateSerializer(serializers.ModelSerializer):
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
