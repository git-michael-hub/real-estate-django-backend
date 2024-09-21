from django.urls import path
from .views import user_login_view, user_list_view, user_create_view, user_detail_view, user_logout_view, password_reset, request_password_reset, email_verification_request_view

urlpatterns = [
    path('auth-user', user_detail_view, name='auth-user'),
    path('login', user_login_view, name='login'),
    path('logout', user_logout_view, name='logout'),
    path('request-email-verification',
         email_verification_request_view, name='request-email-verification'),
    path('register', user_create_view, name='register'),
    path('request-password-reset', request_password_reset,
         name='request-password-reset'),
    path('password-reset/<str:token>',
         password_reset, name='password-reset'),
    path('users', user_list_view),  # DEVELOPMENT ONLY
]
