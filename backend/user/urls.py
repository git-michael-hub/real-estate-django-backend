from django.urls import path
from .views import user_login_view, user_list_view, user_create_view, user_detail_view, user_logout_view

urlpatterns = [
    path('', user_list_view),
    path('auth', user_detail_view),
    path('login', user_login_view),
    path('register', user_create_view),
    path('logout', user_logout_view)
]
