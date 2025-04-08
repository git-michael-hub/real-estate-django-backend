from django.urls import path

from offers.views import BuyerOfferListCreateView, BuyerOfferRetrieveUpdateView

from transactions.views import BuyerTransactionListView, BuyerTransactionRetrieveUpdateView

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
         name='wishlist-entry-destroy'),

    path('<str:username>/offers',
         BuyerOfferListCreateView.as_view(),
         name='buyer-offer-list-create'),

    path('<str:username>/offers/<int:pk>',
         BuyerOfferRetrieveUpdateView.as_view(),
         name='buyer-offer-retrieve-update'),

    path('<str:username>/transactions',
         BuyerTransactionListView.as_view(),
         name='buyer-transaction-list'),

    path('<str:username>/transactions/<int:pk>',
         BuyerTransactionRetrieveUpdateView.as_view(),
         name='buyer-transaction-retrieve-update')
]
