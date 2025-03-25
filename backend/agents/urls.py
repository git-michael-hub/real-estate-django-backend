from django.urls import path

from property_agent_assignments.views import AssignedPropertyListView, AssignedPropertyRetrieveView

from listings.views import AgentListingListCreateView, AgentListingRetrieveUpdateDestroyView

from .views import (
    AgentAccountListView,
    AgentAccountRetrieveUpdateView,
    AgentApplicationListCreateView,
    AgentApplicationRetrieveView,
    AgentApplicationCancelView
)

urlpatterns = [
    path('', AgentAccountListView.as_view(), name='agent-account-list'),

    path('<str:username>',
         AgentAccountRetrieveUpdateView.as_view(),
         name='agent-account-retrieve-update'),

    path('<str:username>/applications',
         AgentApplicationListCreateView.as_view(),
         name='agent-application-list-create'),

    path('<str:username>/applications/<int:pk>',
         AgentApplicationRetrieveView.as_view(),
         name='agent-application-retrieve'),

    path('<str:username>/applications/<int:pk>/cancel',
         AgentApplicationCancelView.as_view(),
         name='agent-application-cancel'),

    path('<str:username>/assigned-properties',
         AssignedPropertyListView.as_view(),
         name='assigned-property-list'),

    path('<str:username>/assigned-properties/<int:pk>',
         AssignedPropertyRetrieveView.as_view(),
         name='assigned-property-retrieve'),

    path('<str:username>/listings',
         AgentListingListCreateView.as_view(),
         name='agent-listing-list-create'),

    path('<str:username>/listings/<int:pk>',
         AgentListingRetrieveUpdateDestroyView.as_view(),
         name='agent-listing-retrieve-update-destroy')
]
