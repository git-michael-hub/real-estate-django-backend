from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response

from users.permissions import IsSeller

from .models import Property
from .serializers import (
    PropertyListSerializer,
    PropertyCreateSerializer,
    PropertyRetreiveSerializer,
    PropertyUpdateSerializer
)
from .permissions import IsPropertyOwner


class PropertyListCreateView(generics.ListCreateAPIView):
    def get_queryset(self):
        username = self.kwargs.get('username')
        queryset = Property.objects.filter(
            seller_account__user__username=username,
            is_deleted=False)
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropertyCreateSerializer
        return PropertyListSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsPropertyOwner(), IsSeller()]
        return [IsPropertyOwner()]


class PropertyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsPropertyOwner]
    lookup_field = 'pk'

    def get_queryset(self):
        return Property.objects.filter(is_deleted=False)

    def destroy(self, request, *args, **kwargs):
        property = self.get_object()
        if property.has_listings():
            return Response({"error": "You cannot delete a property with active listings."}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_destroy(property)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PropertyRetreiveSerializer
        if self.request.method in ['PUT', 'PATCH']:
            return PropertyUpdateSerializer
        return super().get_serializer_class()
