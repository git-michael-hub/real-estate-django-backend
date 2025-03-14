from django.urls import path
from .views import (
    AgentAccountListView,
    AgentAccountRetrieveUpdateView,
    AgentApplicationListCreateView,
    AgentApplicationRetrieveView,
    AgentApplicationCancelView
)

urlpatterns = [
    path('', AgentAccountListView.as_view(), name='agent-account-list'),

    path('<str:username>',
         AgentAccountRetrieveUpdateView.as_view(),
         name='agent-account-retrieve-update'),

    path('<str:username>/applications',
         AgentApplicationListCreateView.as_view(),
         name='agent-application-list-create'),

    path('<str:username>/applications/<int:pk>',
         AgentApplicationRetrieveView.as_view(),
         name='agent-application-retrieve'),

    path('<str:username>/applications/<int:pk>/cancel',
         AgentApplicationCancelView.as_view(),
         name='agent-application-cancel')
]
