from django.urls import path
from .views import BuyerAccountRetrieveUpdateView, WishlistEntryListCreateView, WishlistEntryDestroyView

urlpatterns = [
    path('<str:username>',
         BuyerAccountRetrieveUpdateView.as_view(),
         name='buyer-retrieve-update'),

    path('<str:username>/wishlist',
         WishlistEntryListCreateView.as_view(),
         name='wishlist-entry-list-create'),

    path('<str:username>/wishlist/<int:pk>',
         WishlistEntryDestroyView.as_view(),
         name='wishlist-entry-destroy')
]
