from rest_framework import serializers

from users.serializers import UserDetailSerializer

from listings.serializers import ListingDetailSerializer
from listings.validators import listing_id_is_valid

from .models import BuyerAccount


class BuyerAccountDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerAccount
        fields = '__all__'


class BuyerDetailSerializer(BuyerAccountDetailSerializer):
    user = UserDetailSerializer()

    class Meta(BuyerAccountDetailSerializer.Meta):
        fields = BuyerAccountDetailSerializer.Meta.fields


class BuyerWishlistSerializer(serializers.ModelSerializer):

    class Meta:
        model = BuyerAccount
        fields = ['wishlist']


class BuyerWishlistAddRemoveSerializer(serializers.Serializer):
    add_to_favorites = serializers.IntegerField(
        validators=[listing_id_is_valid], required=False)
    remove_from_favorites = serializers.IntegerField(
        validators=[listing_id_is_valid], required=False)
