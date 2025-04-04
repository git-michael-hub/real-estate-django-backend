from rest_framework import serializers, exceptions

from listings.models import Listing
from listings.serializers import ListingListSerializer

from buyers.models import BuyerAccount
from buyers.serializers import BuyerAccountListSerializer

from agents.serializers import AgentAccountListSerializer

from sellers.serializers import SellerAccountListSerializer

from .models import Offer, OFFER_RESPONSE
from .mixins import OfferUpdateSerializerMixin, OfferGetCreatedByMixin


class OfferCreateSerializer(serializers.ModelSerializer):
    listing = serializers.PrimaryKeyRelatedField(
        queryset=Listing.objects.all())
    buyer_account = serializers.PrimaryKeyRelatedField(
        queryset=BuyerAccount.objects.all())

    class Meta:
        model = Offer
        fields = ['listing', 'buyer_account', 'payment_method', 'price',
                  'created_by_id', 'created_by_type', 'buyer_offer_response',
                  'seller_offer_response', 'agent_offer_response']

    def validate(self, attrs):
        user = self.context['request'].user
        listing = attrs.get('listing')

        if attrs.get('seller_offer_response'):
            if user.seller_account != listing.property.seller_account:
                raise exceptions.PermissionDenied(
                    'You are not allowed to create offers for this listing.')

        elif attrs.get('agent_offer_response'):
            if user.agent_account != listing.agent_account:
                raise exceptions.PermissionDenied(
                    'You are not allowed to create offers for this listing.')

        attrs['agent_account'] = getattr(listing, 'agent_account', None)
        attrs['seller_account'] = getattr(listing.property, 'seller_account')
        return attrs


class OfferListSerializer(OfferGetCreatedByMixin, serializers.ModelSerializer):
    listing = ListingListSerializer()
    created_by = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = ['pk', 'listing', 'created_by', 'price', 'date_created']


class OfferRetrieveSerializer(OfferGetCreatedByMixin, serializers.ModelSerializer):
    listing = ListingListSerializer()
    buyer_account = BuyerAccountListSerializer()
    seller_account = SellerAccountListSerializer()
    agent_account = AgentAccountListSerializer()
    created_by = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = '__all__'


class BuyerOfferUpdateSerializer(OfferUpdateSerializerMixin, serializers.ModelSerializer):
    buyer_offer_response = serializers.ChoiceField(
        choices=OFFER_RESPONSE.CHOICES)

    class Meta:
        model = Offer
        fields = ['buyer_offer_response']

    def validate(self, attrs):
        attrs['offer_response'] = attrs.get('buyer_offer_response')
        return super().validate(attrs)


class SellerOfferUpdateSerializer(OfferUpdateSerializerMixin, serializers.ModelSerializer):
    seller_offer_response = serializers.ChoiceField(
        choices=OFFER_RESPONSE.CHOICES)

    class Meta:
        model = Offer
        fields = ['seller_offer_response']

    def validate(self, attrs):
        attrs['offer_response'] = attrs.get('seller_offer_response')
        return super().validate(attrs)


class AgentOfferUpdateSerializer(OfferUpdateSerializerMixin, serializers.ModelSerializer):
    agent_offer_response = serializers.ChoiceField(
        choices=OFFER_RESPONSE.CHOICES)

    class Meta:
        model = Offer
        fields = ['agent_offer_response']

    def validate(self, attrs):
        attrs['offer_response'] = attrs.get('agent_offer_response')
        return super().validate(attrs)
