from rest_framework import generics

from users.mixins import RetrieveByUsernameMixin

from .models import AgentAccount, AgentApplication, AGENT_APP_STATUS
from .permissions import IsAgentApplicationOwner, IsAgentAccountOwnerOrReadOnly
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


class AgentApplicationListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAgentApplicationOwner]

    def get_queryset(self):
        agent_account = self.request.user.agent_account
        return AgentApplication.objects.filter(agent_account=agent_account)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AgentApplicationCreateSerialier
        return AgentApplicationListSerializer


class AgentApplicationRetrieveView(generics.RetrieveAPIView):
    permission_classes = [IsAgentApplicationOwner]
    serializer_class = AgentApplicationRetrieveSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return AgentApplication.objects.all()


class AgentApplicationCancelView(generics.UpdateAPIView):
    permission_classes = [IsAgentApplicationOwner]
    serializer_class = AgentApplicationCancelSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return AgentApplication.objects.filter(status=AGENT_APP_STATUS.PENDING)


class AgentAccountListView(generics.ListAPIView):
    serializer_class = AgentAccountListSerializer

    def get_queryset(self):
        return AgentAccount.objects.filter(is_active=True)


class AgentAccountRetrieveUpdateView(RetrieveByUsernameMixin, generics.RetrieveUpdateAPIView):
    permission_classes = [IsAgentAccountOwnerOrReadOnly]

    def get_queryset(self):
        return AgentAccount.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return AgentAccountUpdateSerializer
        return AgentAccountRetrieveSerializer
