from django.urls import path
from .views import UserListView, CustomAuthToken

urlpatterns = [
    path('', UserListView.as_view()),
    path('login', CustomAuthToken.as_view())
]
