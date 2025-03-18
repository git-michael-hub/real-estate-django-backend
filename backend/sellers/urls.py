from django.urls import path

from properties.views import PropertyListCreateView, PropertyRetrieveUpdateDestroyView

from property_agent_assignments.views import AssignedAgentListCreateView, AssignedAgentRetrieveDestroyView

from .views import (
    SellerAccountRetrieveUpdateView,
    SellerAccountListView,
    SellerApplicationListCreateView,
    SellerApplicationRetrieveView,
    SellerApplicationCancelView
)

urlpatterns = [
    path('', SellerAccountListView.as_view(), name='seller-account-list'),

    path('<str:username>',
         SellerAccountRetrieveUpdateView.as_view(),
         name='seller-account-retrieve-update'),

    path('<str:username>/applications',
         SellerApplicationListCreateView.as_view(),
         name='seller-application-list-create'),

    path('<str:username>/applications/<int:pk>',
         SellerApplicationRetrieveView.as_view(),
         name='seller-application-retrieve'),

    path('<str:username>/applications/<int:pk>/cancel',
         SellerApplicationCancelView.as_view(),
         name='seller-application-cancel'),

    path('<str:username>/properties',
         PropertyListCreateView.as_view(),
         name='seller-property-list-create'),

    path('<str:username>/properties/<int:pk>',
         PropertyRetrieveUpdateDestroyView.as_view(),
         name='seller-property-retrieve-update-destroy'),

    path('<str:username>/properties/<int:property_pk>/property-agent-assignment',
         AssignedAgentListCreateView.as_view(),
         name='assigned-agent-list-create'),

    path('<str:username>/properties/<int:property_pk>/property-agent-assignment/<int:pk>',
         AssignedAgentRetrieveDestroyView.as_view(),
         name='assigned-agent-retrieve-destroy'),
]
