from rest_framework import generics

from users.permissions import IsAccountOwner

from sellers.permissions import IsSeller

from agents.permissions import IsAgent

from .models import Transaction
from .permissions import IsTransactionBuyer, IsTransactionSeller, IsTransactionAgent
from .serializers import (
    TransactionListSerializer,
    TransactionRetrieveSerializer,
    BuyerTransactionUpdateSerializer,
    SellerTransactionUpdateSerializer,
    AgentTransactionUpdateSerializer
)


class BuyerTransactionListView(generics.ListAPIView):
    serializer_class = TransactionListSerializer
    permission_classes = [IsAccountOwner]

    def get_queryset(self):
        buyer_account = self.request.user.buyer_account
        return Transaction.objects.filter(offer__buyer_account=buyer_account)


class SellerTransactionListView(generics.ListAPIView):
    serializer_class = TransactionListSerializer
    permission_classes = [IsAccountOwner, IsSeller]

    def get_queryset(self):
        seller_account = self.request.user.seller_account
        return Transaction.objects.filter(offer__seller_account=seller_account)


class AgentTransactionListView(generics.ListAPIView):
    serializer_class = TransactionListSerializer
    permission_classes = [IsAccountOwner, IsAgent]

    def get_queryset(self):
        agent_account = self.request.user.agent_account
        return Transaction.objects.filter(offer__agent_account=agent_account)


class BuyerTransactionRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsTransactionBuyer]
    lookup_field = 'pk'

    def get_queryset(self):
        buyer_account = self.request.user.buyer_account
        return Transaction.objects.filter(offer__buyer_account=buyer_account)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TransactionRetrieveSerializer
        return BuyerTransactionUpdateSerializer


class SellerTransactionRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsTransactionSeller]
    lookup_field = 'pk'

    def get_queryset(self):
        seller_account = self.request.user.seller_account
        return Transaction.objects.filter(offer__seller_account=seller_account)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TransactionRetrieveSerializer
        return SellerTransactionUpdateSerializer


class AgentTransactionRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsTransactionAgent]
    lookup_field = 'pk'

    def get_queryset(self):
        agent_account = self.request.user.agent_account
        return Transaction.objects.filter(offer__agent_account=agent_account)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TransactionRetrieveSerializer
        return AgentTransactionUpdateSerializer
