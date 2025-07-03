from django.db.models import Q

from rest_framework import generics, status
from rest_framework.response import Response

from sellers.permissions import IsSeller

from .mixins import PropertyQueryFiltersMixin
from .models import Property, PROPERTY_STATUS
from .pagination import PropertyPagination
from .serializers import (
    PropertyListSerializer,
    PropertyCreateSerializer,
    PropertyRetreiveSerializer,
    PropertyUpdateSerializer

)
from .permissions import IsPropertyOwner


class PropertyListCreateView(PropertyQueryFiltersMixin, generics.ListCreateAPIView):
    pagination_class = PropertyPagination

    def get_queryset(self):
        properties = Property.objects.all()
        seller_account = self.request.user.seller_account
        filters = Q(is_deleted=False, seller_account=seller_account)
        return self.filter_by_default_queries(properties, filters)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropertyCreateSerializer
        return PropertyListSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsSeller()]
        return []


class PropertyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsPropertyOwner]
    lookup_field = 'pk'

    def get_queryset(self):
        return Property.objects.filter(is_deleted=False)

    def destroy(self, request, *args, **kwargs):
        property = self.get_object()
        if property.status in [PROPERTY_STATUS.LISTED, PROPERTY_STATUS.HOLD]:
            return Response({"error": "You cannot delete a property with active listings or with accepted offer."},
                            status=status.HTTP_400_BAD_REQUEST)
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
