from django.db import models

from agents.models import AgentAccount

from properties.models import Property


class PropertyAgentAssignment(models.Model):
    property = models.ForeignKey(
        Property, related_name='assigned_agents', on_delete=models.CASCADE)
    agent = models.ForeignKey(
        AgentAccount, related_name='assigned_properties', on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
