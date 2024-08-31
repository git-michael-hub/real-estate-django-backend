from django.urls import path
from .views import listing_create_view, listing_list_view, listing_detail_view, ListingTestListView

urlpatterns = [
    path('', listing_list_view),
    path('<int:pk>', listing_detail_view),
    path('new', listing_create_view),
    path('test', ListingTestListView.as_view())  # DEVELOPMENT ONLY
]
