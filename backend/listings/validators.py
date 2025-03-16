from rest_framework import serializers
from .models import Listing


def listing_id_is_valid(pk):
    listing = Listing.objects.filter(pk=pk).first()
    if not listing:
        raise serializers.ValidationError('Listing does not exist.')
    return pk
