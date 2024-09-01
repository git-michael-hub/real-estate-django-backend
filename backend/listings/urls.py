from django.urls import path
from .views import listing_list_create_view, listing_detail_view

urlpatterns = [
    path('', listing_list_create_view),
    path('<int:pk>', listing_detail_view),
]
