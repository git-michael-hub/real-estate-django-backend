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
        fields = ['pk', 'listing', 'date_added']
        extra_kwargs = {'pk': {'read_only': True},
                        'date_added': {'read_only': True}}

    def validate(self, attrs):
        listing = attrs.get('listing')
        buyer_account = self.context['request'].user.buyer_account

        if WishlistEntry.objects.filter(
                listing=listing, buyer_account=buyer_account).exists():
            raise serializers.ValidationError(
                f"Listing {listing.pk} already added in wishlist.")

        attrs['buyer_account'] = buyer_account
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        listing = Listing.objects.get(pk=data['listing'])
        data['listing'] = ListingListSerializer(listing).data
        return data


class WishlistEntryListSerializer(serializers.ModelSerializer):
    listing = ListingListSerializer()

    class Meta:
        model = WishlistEntry
        fields = ['pk', 'listing', 'date_added']


class BuyerAccountRetrieveUpdateSerializer(serializers.ModelSerializer):
    user = UserRetrieveSerializer(read_only=True)

    class Meta:
        model = BuyerAccount
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}


class BuyerAccountListSerializer(serializers.ModelSerializer):
    user = UserRetrieveSerializer()

    class Meta:
        model = BuyerAccount
        fields = ['user']
