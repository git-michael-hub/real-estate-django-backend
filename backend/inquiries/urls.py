from django.urls import path
from .views import mail_inquiry_view

urlpatterns = [
    #     path('<str:recipient_username>', inquiries_list_create_view,
    #          name='inquiries_list_create'),

    #     path('<str:recipient_username>/<int:id>', inquiries_detail_edit_delete_view,
    #          name='inquiries_detail_edit_delete'),
    path('mail_inquiry', mail_inquiry_view, name="mail_inquiry")
]
