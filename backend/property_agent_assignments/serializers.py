from rest_framework import serializers

from agents.models import AgentAccount
from agents.serializers import AgentAccountListSerializer

from properties.models import Property
from properties.serializers import PropertyListSerializer

from .models import PropertyAgentAssignment


class PropertyAgentAssignmentRetrieveSerializer(serializers.ModelSerializer):
    agent = AgentAccountListSerializer()
    property = PropertyListSerializer()

    class Meta:
        model = PropertyAgentAssignment
        fields = '__all__'


class PropertyAgentAssignmentCreateSerializer(serializers.ModelSerializer):
    agent = serializers.PrimaryKeyRelatedField(
        queryset=AgentAccount.objects.all(), required=True)
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(), required=True)

    class Meta:
        model = PropertyAgentAssignment
        fields = ['agent', 'property']


class AssignedAgentListSerializer(serializers.ModelSerializer):
    agent = AgentAccountListSerializer()
    date_added = serializers.DateTimeField(
        format="%B %d, %Y", read_only=True)

    class Meta:
        model = PropertyAgentAssignment
        fields = ['agent', 'date_added']


class AssignedPropertyListSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer()
    date_added = serializers.DateTimeField(
        format="%B %d, %Y", read_only=True)

    class Meta:
        model = PropertyAgentAssignment
        fields = ['property', 'date_added']
