from rest_framework import generics

from users.mixins import RetrieveByUsernameMixin
from users.permissions import IsAccountOwner

from .models import BuyerAccount, WishlistEntry
from .permissions import IsBuyerAccountOwnerOrReadOnly, IsWishlistEntryOwner
from .serializers import (
    BuyerAccountRetrieveSerializer,
    BuyerAccountUpdateSerializer,
    WishlistEntryCreateSerializer,
    WishlistEntryListSerializer
)


class BuyerAccountRetrieveUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = BuyerAccount.objects.all()
    permission_classes = [IsBuyerAccountOwnerOrReadOnly]
    lookup_field = 'username'

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'POST']:
            return BuyerAccountUpdateSerializer
        return BuyerAccountRetrieveSerializer


class WishlistEntryListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAccountOwner]

    def get_queryset(self):
        username = self.kwargs.get('username')
        queryset = WishlistEntry.objects.filter(
            buyer_account__user__username=username)
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return WishlistEntryCreateSerializer
        return WishlistEntryListSerializer


class WishlistEntryDestroyView(generics.DestroyAPIView):
    queryset = WishlistEntry.objects.all()
    permission_classes = [IsWishlistEntryOwner]
    lookup_field = 'pk'
