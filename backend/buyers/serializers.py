from rest_framework import serializers

from users.serializers import UserDetailSerializer
from users.mixins import CreateEmailValidationRequestSerializerMixin, ValidatePinCodeSerializerMixin

from listings.serializers import ListingDetailSerializer
from listings.validators import listing_id_is_valid

from .models import BuyerAccount, BuyerEmailValidationRequest


class BuyerEmailValidationRequestSerializer(CreateEmailValidationRequestSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = BuyerEmailValidationRequest
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            'pin_code': {'write_only': True}
        }


class BuyerEmailValidationSerializer(ValidatePinCodeSerializerMixin, serializers.Serializer):
    email = serializers.EmailField()
    pin_code = serializers.IntegerField()

    class Meta:
        model = BuyerEmailValidationRequest


class BuyerAccountDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerAccount
        fields = '__all__'


class BuyerDetailSerializer(BuyerAccountDetailSerializer):
    user = UserDetailSerializer()

    class Meta(BuyerAccountDetailSerializer.Meta):
        fields = BuyerAccountDetailSerializer.Meta.fields


class BuyerListingFavoritesRetrieveSerializer(serializers.Serializer):
    user = UserDetailSerializer()
    favorite_listings = ListingDetailSerializer(many=True)


class BuyerListingFavoritesAddRemoveSerializer(serializers.Serializer):
    add_to_favorites = serializers.IntegerField(
        validators=[listing_id_is_valid], required=False)
    remove_from_favorites = serializers.IntegerField(
        validators=[listing_id_is_valid], required=False)
