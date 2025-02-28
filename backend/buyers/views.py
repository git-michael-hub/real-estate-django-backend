from rest_framework import generics
from rest_framework.response import Response

from users.mixins import RetrieveByUsernameMixin

from .models import BuyerAccount
from .serializers import BuyerDetailSerializer, BuyerWishlistSerializer, BuyerWishlistAddRemoveSerializer
from .permissions import IsBuyerAccountOwnerOrReadOnly, IsBuyerAccountOwner


class BuyerDetailUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = BuyerAccount
    serializer_class = BuyerDetailSerializer
    permission_classes = [IsBuyerAccountOwnerOrReadOnly]
    lookup_field = 'username'


buyer_detail_update_view = BuyerDetailUpdateView.as_view()


class BuyerWishlistRetrieveUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = BuyerAccount
    serializer_class = BuyerWishlistSerializer
    permission_classes = [IsBuyerAccountOwner]
    lookup_field = 'username'

    def partial_update(self, request, username):
        buyer_account = self.get_object()

        add_remove_serializer = BuyerWishlistAddRemoveSerializer(
            data=request.data)
        add_remove_serializer.is_valid(raise_exception=True)

        data = add_remove_serializer.validated_data

        add_listing = data.get('add_to_wishlist')
        if add_listing is not None:
            buyer_account.wishlist.add(add_listing)

        remove_listing = data.get('remove_from_wishlist')
        if remove_listing is not None:
            buyer_account.wishlist.remove(remove_listing)

        serializer = self.get_serializer(buyer_account)
        return Response(serializer.data)


buyer_wishlist_detail_update_view = BuyerWishlistRetrieveUpdateView.as_view()
