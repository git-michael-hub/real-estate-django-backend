from django.urls import path
from .views import user_login_view, user_detail_view, user_logout_view, password_reset, request_password_reset

urlpatterns = [
    path('auth-user', user_detail_view, name='auth-user'),
    path('login', user_login_view, name='login'),
    path('logout', user_logout_view, name='logout'),
    path('request-password-reset', request_password_reset,
         name='request-password-reset'),
    path('password-reset/<str:token>',
         password_reset, name='password-reset'),
]
