from django.urls import path
from .views import listing_create_view, listing_list_view

urlpatterns = [
    path('', listing_list_view),
    path('new', listing_create_view)
]
