from django.urls import path
from .views import (
    UserCreateView,
    UserEmailVerificationView,
    UserLoginView,
    UserRetrieveView,
    UserLogoutView,
    ResetPasswordView,
    PasswordResetRequestView,
)

urlpatterns = [
    path('user', UserRetrieveView.as_view(), name='user'),
    path('register', UserCreateView.as_view(), name='register'),
    path('login', UserLoginView.as_view(), name='login'),
    path('logout', UserLogoutView.as_view(), name='logout'),

    path('verify-email/<str:email>',
         UserEmailVerificationView.as_view(),
         name='verify-email'),

    path('request-password-reset',
         PasswordResetRequestView.as_view(),
         name='request-password-reset'),

    path('reset-password/<str:token>',
         ResetPasswordView.as_view(),
         name='reset-password'),
]
