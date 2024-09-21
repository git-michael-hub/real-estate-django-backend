from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response

from users.mixins import CreateEmailValidationRequestMixin, RetrieveByUsernameMixin

from .models import BuyerEmailValidationRequest, BuyerAccount
from .serializers import BuyerEmailValidationRequestSerializer, BuyerEmailValidationSerializer, BuyerDetailSerializer, BuyerListingFavoritesRetrieveSerializer, BuyerListingFavoritesAddRemoveSerializer
from .permissions import IsBuyerAccountOwnerOrReadOnly, IsBuyerAccountOwner


class BuyerValidationView(CreateEmailValidationRequestMixin, generics.CreateAPIView):
    serializer_class = BuyerEmailValidationRequestSerializer


buyer_validation_view = BuyerValidationView.as_view()


class BuyerCreateView(generics.CreateAPIView):
    def create(self, request):
        serializer = BuyerEmailValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        email_validation_request = BuyerEmailValidationRequest.objects.filter(
            email=data['email'], pin_code=data['pin_code'])[0]

        user = User(email=email_validation_request.email,
                    username=email_validation_request.username,
                    password=email_validation_request.password)
        user.save()

        buyer_account = BuyerAccount(
            user=user,
            first_name=email_validation_request.first_name,
            last_name=email_validation_request.last_name)
        buyer_account.save()

        email_validation_request.delete()

        return Response({'success': ['Registration complete!']}, status=status.HTTP_201_CREATED)


buyer_create_view = BuyerCreateView.as_view()


class BuyerDetailUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = BuyerAccount
    serializer_class = BuyerDetailSerializer
    permission_classes = [IsBuyerAccountOwnerOrReadOnly]
    lookup_field = 'username'


buyer_detail_update_view = BuyerDetailUpdateView.as_view()


class BuyerListingFavoritesRetrieveUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    queryset = BuyerAccount
    serializer_class = BuyerListingFavoritesRetrieveSerializer
    permission_classes = [IsBuyerAccountOwner]
    lookup_field = 'username'

    def partial_update(self, request, username):
        buyer_account = self.get_object()

        add_remove_serializer = BuyerListingFavoritesAddRemoveSerializer(
            data=request.data)
        add_remove_serializer.is_valid(raise_exception=True)

        add_listing = add_remove_serializer.validated_data.get(
            'add_to_favorites')
        if add_listing is not None:
            buyer_account.favorite_listings.add(add_listing)

        remove_listing = add_remove_serializer.validated_data.get(
            'remove_from_favorites')
        if remove_listing is not None:
            buyer_account.favorite_listings.remove(remove_listing)

        serializer = self.get_serializer(buyer_account)
        return Response(serializer.data)


buyer_listing_favorites_detail_update_view = BuyerListingFavoritesRetrieveUpdateView.as_view()
