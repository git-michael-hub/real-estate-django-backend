from rest_framework import serializers
from .models import Listing


def listing_id_is_valid(id):
    listing = Listing.objects.get(id=id)
    if listing.exists():
        return id
    else:
        raise serializers.ValidationError('Listing does not exist.')
