
from rest_framework import generics

from users.mixins import RetrieveByUsernameMixin

from .models import SellerApplication, SellerAccount, SELLER_APP_STATUS
from .permissions import IsSellerAccountOwnerOrReadOnly, IsSellerApplicationOwner
from .serializers import (
    # SellerApplication Serializers
    SellerApplicationCreateSerializer,
    SellerApplicationListSerializer,
    SellerApplicationRetrieveSerializer,
    SellerApplicationCancelSerializer,

    # SellerAccount Serializers
    SellerAccountRetrieveSerializer,
    SellerAccountUpdateSerializer,
    SellerAccountListSerializer
)


class SellerApplicationListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsSellerApplicationOwner]

    def get_queryset(self):
        seller_account = self.request.user.seller_account
        return SellerApplication.objects.filter(seller_account=seller_account)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SellerApplicationCreateSerializer
        return SellerApplicationListSerializer


class SellerApplicationRetrieveView(generics.RetrieveAPIView):
    queryset = SellerApplication.objects.all()
    permission_classes = [IsSellerApplicationOwner]
    serializer_class = SellerApplicationRetrieveSerializer
    lookup_field = 'pk'


class SellerApplicationCancelView(generics.UpdateAPIView):
    queryset = SellerApplication.objects.filter(
        status=SELLER_APP_STATUS.PENDING)
    permission_classes = [IsSellerApplicationOwner]
    serializer_class = SellerApplicationCancelSerializer
    lookup_field = 'pk'


class SellerAccountListView(generics.ListAPIView):
    queryset = SellerAccount.objects.filter(is_active=True)
    serializer_class = SellerAccountListSerializer


class SellerAccountRetrieveUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = SellerAccount.objects.all()
    permission_classes = [IsSellerAccountOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return SellerAccountUpdateSerializer
        return SellerAccountRetrieveSerializer
