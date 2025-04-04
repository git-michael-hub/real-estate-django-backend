from django.db.models import Q

from rest_framework import generics

from buyers.models import BuyerAccount

from sellers.models import SellerAccount
from sellers.permissions import IsSeller

from agents.models import AgentAccount
from agents.permissions import IsAgent

from users.permissions import IsAccountOwner

from .models import Offer
from .mixins import OfferListCreateMixin, OfferInsertFiltersMixin
from .permissions import IsOfferBuyer, IsOfferSeller, IsOfferAgent
from .serializers import (
    OfferRetrieveSerializer,
    BuyerOfferUpdateSerializer,
    SellerOfferUpdateSerializer,
    AgentOfferUpdateSerializer
)


class BuyerOfferListCreateView(OfferListCreateMixin,
                               OfferInsertFiltersMixin,
                               generics.ListCreateAPIView):
    permission_classes = [IsAccountOwner]

    def create(self, request, *args, **kwargs):
        return super().create(request, model_class=BuyerAccount)

    def get_queryset(self):
        filters = self.insert_filter_by_listing_id(
            Q(buyer_account=self.request.user.buyer_account))
        return Offer.objects.filter(filters)


class SellerOfferListCreateView(OfferListCreateMixin,
                                OfferInsertFiltersMixin,
                                generics.ListCreateAPIView):
    permission_classes = [IsAccountOwner, IsSeller]

    def create(self, request, *args, **kwargs):
        return super().create(request, model_class=SellerAccount)

    def get_queryset(self):
        filters = self.insert_filter_by_listing_id(
            Q(seller_account=self.request.user.seller_account))
        return Offer.objects.filter(filters)


class AgentOfferListCreateView(OfferListCreateMixin,
                               OfferInsertFiltersMixin,
                               generics.ListCreateAPIView):
    permission_classes = [IsAccountOwner, IsAgent]

    def create(self, request, *args, **kwargs):
        return super().create(request, model_class=AgentAccount)

    def get_queryset(self):
        filters = self.insert_filter_by_listing_id(
            Q(agent_account=self.request.user.agent_account))
        return Offer.objects.filter(filters)


class BuyerOfferRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOfferBuyer]
    lookup_field = 'pk'

    def get_queryset(self):
        buyer_account = self.request.user.buyer_account
        return Offer.objects.filter(buyer_account=buyer_account)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OfferRetrieveSerializer
        return BuyerOfferUpdateSerializer


class SellerOfferRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOfferSeller]
    lookup_field = 'pk'

    def get_queryset(self):
        seller_account = self.request.user.seller_account
        return Offer.objects.filter(seller_account=seller_account)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OfferRetrieveSerializer
        return SellerOfferUpdateSerializer


class AgentOfferRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOfferAgent]
    lookup_field = 'pk'

    def get_queryset(self):
        agent_account = self.request.user.agent_account
        return Offer.objects.filter(agent_account=agent_account)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OfferRetrieveSerializer
        return AgentOfferUpdateSerializer
