from rest_framework import generics

from users.permissions import IsAccountOwner

from .models import PropertyAgentAssignment
from .permissions import IsPropertyAgentAssignmentOwner, IsPropertyAgentAssignedAgent
from .serializers import (
    PropertyAgentAssignmentRetrieveSerializer,
    PropertyAgentAssignmentCreateSerializer,
    AssignedAgentListSerializer,
    AssignedPropertyListSerializer
)


class AssignedAgentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsPropertyAgentAssignmentOwner]

    def get_queryset(self):
        pk = self.kwargs.get('property_pk')
        return PropertyAgentAssignment.objects.filter(property__pk=pk)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AssignedAgentListSerializer
        return PropertyAgentAssignmentCreateSerializer


class AssignedAgentRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsPropertyAgentAssignmentOwner]
    serializer_class = PropertyAgentAssignmentRetrieveSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return PropertyAgentAssignment.objects.all()


class AssignedPropertyRetrieveView(generics.RetrieveAPIView):
    permission_classes = [IsPropertyAgentAssignedAgent]
    serializer_class = PropertyAgentAssignmentRetrieveSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        username = self.kwargs.get('username')
        return PropertyAgentAssignment.objects.filter(agent__user__username=username)


class AssignedPropertyListView(generics.ListAPIView):
    permission_classes = [IsAccountOwner]
    serializer_class = AssignedPropertyListSerializer

    def get_queryset(self):
        username = self.kwargs.get('username')
        return PropertyAgentAssignment.objects.filter(agent__user__username=username)
