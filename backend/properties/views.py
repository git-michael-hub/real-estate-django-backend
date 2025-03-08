from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import Property
from .serializers import PropertyListSerializer, PropertyCreateSerializer, PropertyRetreiveSerializer, PropertyUpdateSerializer
from .permissions import IsOwner


class PropertyListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        username = self.kwargs.get('username')
        queryset = Property.objects.filter(
            seller_account__user__username=username)
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropertyCreateSerializer
        return PropertyListSerializer


property_list_create_view = PropertyListCreateView.as_view()


class PropertyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    lookup_field = 'id'

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
        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            return PropertyUpdateSerializer
        return super().get_serializer_class()


property_retrieve_update_destroy_view = PropertyRetrieveUpdateDestroyView.as_view()
