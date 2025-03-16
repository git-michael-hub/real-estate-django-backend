from rest_framework import serializers

from listings.models import Listing
from listings.validators import listing_id_is_valid

from users.serializers import UserRetrieveSerializer

from .models import BuyerAccount


class BuyerWishlistSerializer(serializers.ModelSerializer):
    add_listing = serializers.IntegerField(
        validators=[listing_id_is_valid], required=False)
    remove_listing = serializers.IntegerField(
        validators=[listing_id_is_valid], required=False)

    class Meta:
        model = BuyerAccount
        fields = ['wishlist', 'add_listing', 'remove_listing']
        extra_kwargs = {
            'wishlist': {'read_only': True},
            'add_listing': {'write_only': True},
            'remove_listing': {'write_only': True}
        }

    def update(self, instance, validated_data):
        add_listing = validated_data.get('add_listing')
        if add_listing:
            instance.wishlist.add(add_listing)

        remove_listing = validated_data.get('remove_listing')
        if remove_listing:
            instance.wishlist.remove(remove_listing)

        instance.save()
        return instance


class BuyerAccountRetrieveSerializer(serializers.ModelSerializer):
    user = UserRetrieveSerializer()
    wishlist = BuyerWishlistSerializer(many=True)

    class Meta:
        model = BuyerAccount
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')

        if (
            request.user.is_authenticated and
            request.user.username == instance.user.username
        ):
            return data

        data.pop('wishlist')
        return data


class BuyerAccountUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerAccount
        exclude = ['user', 'wishlist']
