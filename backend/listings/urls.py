from django.urls import path
from .views import ListingSearchView, ListingRetrieveView

urlpatterns = [
    path('',
         ListingSearchView.as_view(),
         name='listing-search'),

    path('<int:pk>',
         ListingRetrieveView.as_view(),
         name='listing-retrieve'),

]
