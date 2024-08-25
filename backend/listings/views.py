from django.shortcuts import render
from rest_framework import generics, authentication
from .serializers import ListingCreateSerializer
from .models import Listing


class ListingCreateView(generics.CreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingCreateSerializer
    authentication_classes = [authentication.TokenAuthentication]


listing_create_view = ListingCreateView.as_view()


class ListingListView(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingCreateSerializer


listing_list_view = ListingListView.as_view()
