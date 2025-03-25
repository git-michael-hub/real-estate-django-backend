from rest_framework import serializers

from listings.models import Listing
from listings.serializers import ListingListSerializer

from users.serializers import UserRetrieveSerializer

from .models import BuyerAccount, WishlistEntry


class WishlistEntryCreateSerializer(serializers.ModelSerializer):
    listing = serializers.PrimaryKeyRelatedField(
        queryset=Listing.objects.all()
    )

    class Meta:
        model = WishlistEntry
        fields = ['listing']

    def validate(self, attrs):
        buyer_account = self.context['request'].user.buyer_account
        attrs['buyer_account'] = buyer_account
        return attrs


class WishlistEntryListSerializer(serializers.ModelSerializer):
    listing = ListingListSerializer()

    class Meta:
        model = WishlistEntry
        fields = ['listing', 'date_added']


class BuyerAccountRetrieveSerializer(serializers.ModelSerializer):
    user = UserRetrieveSerializer()

    class Meta:
        model = BuyerAccount
        fields = '__all__'


class BuyerAccountUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerAccount
        exclude = ['user']
