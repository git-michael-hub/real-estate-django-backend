from django.urls import path
from .views import seller_validation_view, seller_application_view, seller_detail_update_view

urlpatterns = [
    path('seller-validation', seller_validation_view, name='seller-validation'),
    path('seller-application', seller_application_view, name='seller-application'),
    path('<str:username>', seller_detail_update_view, name='seller-detail-update')
]
