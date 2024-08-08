from django.urls import path
from .views import user_login_view, user_list_view, user_create_view

urlpatterns = [
    path('', user_list_view),
    path('login', user_login_view),
    path('register', user_create_view)
]
