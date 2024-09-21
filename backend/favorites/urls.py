from django.urls import path
from .views import favorite_listing_detail_update_view

urlpatterns = [
    path('listings/<str:username>', favorite_listing_detail_update_view,
         name='favorite_listing_detail_update'),
]
