from django.urls import path
from .views import buyer_validation_view, buyer_create_view, buyer_detail_update_view, buyer_listing_favorites_detail_update_view

urlpatterns = [
    path('buyer-validation', buyer_validation_view, name='buyer-validation'),
    path('register', buyer_create_view, name='buyer-create'),
    path('<str:username>', buyer_detail_update_view, name='buyer-detail-update'),
    path('<str:username>/favorite_listings',
         buyer_listing_favorites_detail_update_view, name='buyer-favorite-listings')
]
