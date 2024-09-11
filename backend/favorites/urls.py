from django.urls import path
from .views import favorite_listing_detail_view

urlpatterns = [
    path('<str:username>', favorite_listing_detail_view),
]
