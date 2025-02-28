from django.urls import path
from .views import buyer_detail_update_view, buyer_wishlist_detail_update_view

urlpatterns = [
    path('<str:username>', buyer_detail_update_view, name='buyer-detail-update'),
    path('wishlist/<str:username>',
         buyer_wishlist_detail_update_view, name='buyer-wishlist')
]
