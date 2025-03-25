from django.db.models import Q

from rest_framework import generics

from agents.permissions import IsAgent

from sellers.permissions import IsSeller

from users.permissions import IsAccountOwner

from properties.models import PROPERTY_TYPE

from .models import Listing, LISTING_TYPE, LISTING_STATUS, SORT_OPTIONS
from .mixins import ListingDestroyMixin
from .permissions import IsListingPropertySeller, IsListingAgent
from .pagination import ListingPagination
from .serializers import (
    ListingListSerializer,
    ListingQuerySerializer,
    ListingRetrieveSerializer,
    ListingUpdateSerializer,
    SellerListingCreateSerializer,
    AgentListingCreateSerializer
)


class ListingSearchView(generics.ListAPIView):
    serializer_class = ListingListSerializer
    pagination_class = ListingPagination

    def get_queryset(self):
        query_serializer = ListingQuerySerializer(data=self.request.GET)
        query_serializer.is_valid(raise_exception=True)
        validated_data = query_serializer.validated_data

        property_type = validated_data.get('property_type')
        listing_type = validated_data.get('listing_type')
        province = validated_data.get('province')
        city = validated_data.get('city')
        min_price = validated_data.get('min_price', 0)
        max_price = validated_data.get('max_price')
        min_area = validated_data.get('min_area', 0)
        max_area = validated_data.get('max_area')
        sort_by = validated_data.get('sort_by')

        listings = Listing.objects.all()
        filters = Q(status=LISTING_STATUS.ACTIVE)

        if property_type in dict(PROPERTY_TYPE.CHOICES):
            filters &= Q(property__property_type=property_type)
        if listing_type in dict(LISTING_TYPE.CHOICES):
            filters &= Q(listing_type=listing_type)
        if province:
            filters &= Q(property__province__icontains=province)
        if city:
            filters &= Q(property__city__icontains=city)
        if max_price is not None:
            filters &= Q(price__lte=max_price)
        if min_price is not None:
            filters &= Q(price__gte=min_price)
        if max_area is not None:
            filters &= Q(property__lot_area__lte=max_area)
        if min_area is not None:
            filters &= Q(property__lot_area__gte=min_area)

        listings = listings.filter(filters)
        listings = listings.order_by(SORT_OPTIONS.get(sort_by))

        return listings


class ListingRetrieveView(generics.RetrieveAPIView):
    serializer_class = ListingRetrieveSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Listing.objects.filter(status=LISTING_STATUS.ACTIVE)


class SellerListingListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAccountOwner, IsSeller]

    def get_queryset(self):
        seller_account = self.request.user.seller_account
        return Listing.objects.filter(property__seller_account=seller_account)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SellerListingCreateSerializer
        return ListingListSerializer


class SellerListingRetrieveDestroyView(ListingDestroyMixin, generics.RetrieveDestroyAPIView):
    serializer_class = ListingRetrieveSerializer
    permission_classes = [IsAccountOwner, IsListingPropertySeller]
    lookup_field = 'pk'

    def get_queryset(self):
        seller_account = self.request.user.seller_account
        return Listing.objects.filter(property__seller_account=seller_account)


class AgentListingListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAccountOwner, IsAgent]

    def get_queryset(self):
        agent_account = self.request.user.agent_account
        return Listing.objects.filter(agent_account=agent_account)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AgentListingCreateSerializer
        return ListingListSerializer


class AgentListingRetrieveUpdateDestroyView(ListingDestroyMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAccountOwner, IsListingAgent]
    lookup_field = 'pk'

    def get_queryset(self):
        agent_account = self.request.user.agent_account
        return Listing.objects.filter(agent_account=agent_account)

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'POST']:
            return ListingUpdateSerializer
        return ListingRetrieveSerializer
