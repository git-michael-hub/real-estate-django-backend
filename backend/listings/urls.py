from django.urls import path
from .views import listing_list_create_view, listing_detail_update_delete_view, listing_user_list_view

urlpatterns = [
    path('', listing_list_create_view),
    path('<int:pk>', listing_detail_update_delete_view),
    path('<str:username>', listing_user_list_view)
]
