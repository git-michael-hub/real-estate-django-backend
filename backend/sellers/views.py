
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
    permission_classes = [IsSellerApplicationOwner]
    serializer_class = SellerApplicationRetrieveSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return SellerApplication.objects.all()


class SellerApplicationCancelView(generics.UpdateAPIView):
    permission_classes = [IsSellerApplicationOwner]
    serializer_class = SellerApplicationCancelSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return SellerApplication.objects.filter(
            status=SELLER_APP_STATUS.PENDING)


class SellerAccountListView(generics.ListAPIView):
    serializer_class = SellerAccountListSerializer

    def get_queryset(self):
        return SellerAccount.objects.filter(is_active=True)


class SellerAccountRetrieveUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    permission_classes = [IsSellerAccountOwnerOrReadOnly]

    def get_queryset(self):
        return SellerAccount.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return SellerAccountUpdateSerializer
        return SellerAccountRetrieveSerializer
