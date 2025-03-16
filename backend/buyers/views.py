from rest_framework import generics

from users.mixins import RetrieveByUsernameMixin

from .models import BuyerAccount
from .serializers import BuyerAccountRetrieveSerializer, BuyerAccountUpdateSerializer, BuyerWishlistSerializer
from .permissions import IsBuyerAccountOwnerOrReadOnly, IsBuyerAccountOwner


class BuyerRetrieveUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = BuyerAccount.objects.all()
    permission_classes = [IsBuyerAccountOwnerOrReadOnly]
    lookup_field = 'username'

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'POST']:
            return BuyerAccountUpdateSerializer
        return BuyerAccountRetrieveSerializer


class BuyerWishlistRetrieveUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = BuyerAccount.objects.all()
    serializer_class = BuyerWishlistSerializer
    permission_classes = [IsBuyerAccountOwner]
    lookup_field = 'username'
