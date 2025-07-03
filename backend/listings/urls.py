from django.urls import path

from .views import (
    ListingSearchView,
    ListingRetrieveView,
    SellerListingRetrieveDestroyView,
    SellerListingListCreateView,
    AgentListingListCreateView,
    AgentListingRetrieveUpdateDestroyView
)

urlpatterns = [
    path('',
         ListingSearchView.as_view(),
         name='listing-search'),

    path('<int:pk>',
         ListingRetrieveView.as_view(),
         name='listing-retrieve'),

    path('seller_account',
         SellerListingListCreateView.as_view(),
         name='seller-listing-list-create'),

    path('seller_account/<int:pk>',
         SellerListingRetrieveDestroyView.as_view(),
         name='seller-listing-retrieve-destory'),

    path('agent_account',
         AgentListingListCreateView.as_view(),
         name='agent-listing-list-create'),

    path('agent_account/<int:pk>',
         AgentListingRetrieveUpdateDestroyView.as_view(),
         name='agent-listing-retrieve-update-destroy'),
]
