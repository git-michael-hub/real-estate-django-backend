from django.db.models import Q

from rest_framework import generics

from agents.permissions import IsAgent

from sellers.permissions import IsSeller

from users.permissions import IsAccountOwner

from .models import Listing, LISTING_STATUS
from .mixins import ListingDestroyMixin, ListingQueryFiltersMixin
from .permissions import IsListingPropertySeller, IsListingAgent
from .pagination import ListingPagination
from .serializers import (
    ListingListSerializer,
    ListingRetrieveSerializer,
    ListingUpdateSerializer,
    SellerListingCreateSerializer,
    AgentListingCreateSerializer
)


class ListingSearchView(ListingQueryFiltersMixin, generics.ListAPIView):
    serializer_class = ListingListSerializer
    pagination_class = ListingPagination

    def get_queryset(self):
        listings = Listing.objects.all()
        filters = Q(status=LISTING_STATUS.ACTIVE)
        return self.filter_by_default_queries(listings, filters)


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
