from django.urls import path
from .views import inquiries_list_create_view, inquiries_detail_edit_delete_view

urlpatterns = [
    path('<str:recipient_username>', inquiries_list_create_view,
         name='inquiries_list_create'),

    path('<str:recipient_username>/<int:id>', inquiries_detail_edit_delete_view,
         name='inquiries_detail_edit_delete'),
]
