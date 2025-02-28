
from rest_framework import generics, status, permissions
from rest_framework.response import Response

from users.mixins import RetrieveByUsernameMixin

from .serializers import SellerApplicationCreateSerializer, SellerAccountDetailUpdateSerializer, SellerAccountPartialDetailSerializer
from .models import SellerApplication, SellerAccount
from .permissions import IsSellerAccountOwnerOrReadOnly


class SellerApplicationCreateView(generics.CreateAPIView):
    serializer_class = SellerApplicationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        seller_application = SellerApplication(seller_account=request.user.seller_account,
                                               business_name=data['business_name'],
                                               business_address=data['business_address'])
        seller_application.save()

        return Response({'success': ['Application sent!']}, status=status.HTTP_201_CREATED)


seller_application_view = SellerApplicationCreateView.as_view()


class SellerListView(generics.ListAPIView):
    queryset = SellerAccount.objects.all()
    serializer = SellerAccountPartialDetailSerializer

    def list(self, request):
        sellers = self.get_queryset()
        serializer = SellerAccountPartialDetailSerializer(
            sellers, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


seller_list_view = SellerListView.as_view()


class SellerDetailUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = SellerAccount
    serializer_class = SellerAccountDetailUpdateSerializer
    permission_classes = [IsSellerAccountOwnerOrReadOnly]
    lookup_field = 'username'


seller_detail_update_view = SellerDetailUpdateView.as_view()
