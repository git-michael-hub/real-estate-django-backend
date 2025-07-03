from django.urls import path

from property_agent_assignments.views import AssignedAgentListCreateView

from .views import (
    PropertyListCreateView,
    PropertyRetrieveUpdateDestroyView
)

urlpatterns = [
    path('', PropertyListCreateView.as_view(),
         name='property-list-create'),

    path('<int:pk>', PropertyRetrieveUpdateDestroyView.as_view(),
         name='property-retrieve-update-destroy'),

    path('<int:property_pk>/assigned-agents',
         AssignedAgentListCreateView.as_view(),
         name='assigned-agent-list-create'),
]
