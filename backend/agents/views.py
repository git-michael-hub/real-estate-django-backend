from rest_framework import generics, permissions

from users.mixins import RetrieveByUsernameMixin

from .models import AgentAccount

from .serializers import (
    # AgentApplication Serializers
    AgentApplicationCreateSerialier,
    AgentApplicationListSerializer,
    AgentApplicationRetrieveSerializer,
    AgentApplicationCancelSerializer,

    # AgentAccount Serializers
    AgentAccountListSerializer,
    AgentAccountRetrieveSerializer,
    AgentAccountUpdateSerializer
)

from .permissions import IsAgentAccountOwner

# -------------------------------------------------------------------------------------------


class AgentApplicationListCreateView(generics.ListCreateAPIView):
    queryset = AgentAccount.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AgentApplicationCreateSerialier
        return AgentApplicationListSerializer


agent_application_list_create_view = AgentApplicationListCreateView.as_view()

# -------------------------------------------------------------------------------------------


class AgentApplicationRetrieveView(generics.RetrieveAPIView):
    queryset = AgentAccount.objects.all()
    permission_classes = [IsAgentAccountOwner]
    serializer_class = AgentApplicationRetrieveSerializer
    lookup_field = 'pk'


agent_application_retrieve_view = AgentApplicationRetrieveView.as_view()

# -------------------------------------------------------------------------------------------


class AgentApplicationCancelView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AgentApplicationCancelSerializer


agent_application_cancel_view = AgentApplicationCancelView.as_view()

# -------------------------------------------------------------------------------------------


class AgentAccountListView(generics.ListAPIView):
    queryset = AgentAccount.objects.all()
    serializer_class = AgentAccountListSerializer


agent_account_list_view = AgentAccountListView.as_view()

# -------------------------------------------------------------------------------------------


class AgentAccountRetrieveUpdateView(generics.RetrieveUpdateAPIView, RetrieveByUsernameMixin):
    queryset = AgentAccount.objects.all()

    def get_permissions(self):
        if self.request.method in ['PATCH', 'PUT']:
            return [permissions.IsAuthenticated(), IsAgentAccountOwner()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AgentAccountRetrieveSerializer
        return AgentAccountUpdateSerializer


agent_account_retrieve_update_view = AgentAccountRetrieveUpdateView.as_view()
