from django.urls import path
from .views import buyer_verification_view, buyer_create_view, buyer_detail_update_view

urlpatterns = [
    path('buyer-verification', buyer_verification_view, name='buyer-verification'),
    path('register', buyer_create_view, name='buyer-create'),
    path('<str:username>', buyer_detail_update_view, name='buyer-detail-update')
]
