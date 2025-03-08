from django.urls import path
from .views import (
    agent_account_list_view,
    agent_account_retrieve_update_view,
    agent_application_list_create_view,
    agent_application_retrieve_view,
    agent_application_cancel_view
)

urlpatterns = [
    path('', agent_account_list_view, 'agent-account-list'),

    path('<str>:username',
         agent_account_retrieve_update_view,
         'agent-account-retrieve-update'),

    path('<str>:username/applications',
         agent_application_list_create_view,
         'agent-application-list-create'),

    path('<str>:username/applications/<int>:id',
         agent_application_retrieve_view,
         'agent-application-retrieve'),

    path('<str>:username/applications/<int>:id/cancel',
         agent_application_cancel_view,
         'agent-application-cancel')
]
