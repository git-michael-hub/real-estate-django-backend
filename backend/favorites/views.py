from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response

from .models import Favorites
from .serializers import FavoritesSerializer, FavoritesEditSerializer
from .permissions import IsOwner


class FavoriteListingDetailView(generics.RetrieveUpdateAPIView):
    queryset = Favorites
    serializer_class = FavoritesSerializer
    permission_classes = [IsOwner]

    def get_object(self, username):
        obj = get_object_or_404(
            self.get_queryset(), user__username=username)
        self.check_object_permissions(self.request, obj)
        return obj

    def retrieve(self, request, username):
        favorite_listings = self.get_object(username=username)
        serializer = self.get_serializer(favorite_listings)
        return Response(serializer.data)

    def partial_update(self, request, username):
        favorites = self.get_object(username=username)

        favorites_edit_serializer = FavoritesEditSerializer(data=request.data)
        favorites_edit_serializer.is_valid(raise_exception=True)

        add_listing = favorites_edit_serializer.data['add_to_favorites']
        if add_listing is not None:
            favorites.add(add_listing)

        remove_listing = favorites_edit_serializer.data['remove_from_favorites']
        if add_listing is not None:
            favorites.remove(remove_listing)

        serializer = self.get_serializer(favorites)
        return Response(serializer.data)


favorite_listing_detail_view = FavoriteListingDetailView.as_view()
