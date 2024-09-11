from rest_framework import serializers
from .models import Favorites

from listings.serializers import ListingDetailSerializer
from listings.validators import listing_id_is_valid

from user.serializers import UserSerializer


class FavoritesSerializer(serializers.ModelSerializer):
    listings = ListingDetailSerializer(many=True)

    class Meta:
        model = Favorites
        fields = '__all__'
        read_only_fields = ['user']


class FavoritesEditSerializer(serializers.ModelSerializer):
    add_to_favorites = serializers.IntegerField(
        validators=[listing_id_is_valid], required=False)
    remove_from_favorites = serializers.IntegerField(
        validators=[listing_id_is_valid], required=False)
