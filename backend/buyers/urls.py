from django.urls import path
from .views import BuyerRetrieveUpdateView, BuyerWishlistRetrieveUpdateView

urlpatterns = [
    path('<str:username>',
         BuyerRetrieveUpdateView.as_view(),
         name='buyer-retrieve-update'),

    path('<str:username>/wishlist',
         BuyerWishlistRetrieveUpdateView.as_view(),
         name='buyer-wishlist')
]
