from django.urls import path
from .views import seller_application_view, seller_detail_update_view, seller_list_view

urlpatterns = [
    path('seller-application', seller_application_view, name='seller-application'),
    path('<str:username>', seller_detail_update_view,
         name='seller-detail-update'),
    path('', seller_list_view, name='seller-list')
]
