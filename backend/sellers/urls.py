from django.urls import path
from properties.views import property_list_create_view, property_retrieve_update_destroy_view
from .views import seller_application_view, seller_detail_update_view, seller_list_view

urlpatterns = [
    path('', seller_list_view, name='seller-list'),

    path('seller-application',
         seller_application_view,
         name='seller-application'),

    path('<str:username>',
         seller_detail_update_view,
         name='seller-detail-update'),

    path('<str:username>/properties',
         property_list_create_view,
         name='seller-property-list-create'),

    path('<str:username>/properties/<int:id>',
         property_retrieve_update_destroy_view,
         name='seller-property-retrieve-update-destroy'),
]
