from django.db import transaction
from django.utils import timezone

from rest_framework import serializers

from users.serializers import UserRetrieveSerializer

from .models import AgentAccount, AgentApplication, AGENT_APP_STATUS


class AgentApplicationCreateSerialier(serializers.ModelSerializer):
    class Meta:
        model = AgentApplication
        fields = ['agent_name', 'license_number', 'license_document_path']

    def validate(self, attrs):
        agent_account = self.context['request'].user.agent_account
        if agent_account.is_active:
            raise serializers.ValidationError(
                'Account already have an active Agent account.')

        return attrs

    def create(self, validated_data):
        with transaction.atomic():
            agent_account = self.context['request'].user.agent_account
            agent_account.cancel_active_applications()
            agent_application = AgentApplication.objects.create(
                agent_account=agent_account, **validated_data)

        return agent_application


class AgentApplicationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentApplication
        fields = ['id', 'agent_name', 'status', 'application_date']


class AgentApplicationRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentApplication
        fields = '__all__'


class AgentApplicationCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentApplication
        fields = ['status']

    def validate(self, attrs):
        if attrs.get('status') != AGENT_APP_STATUS.CANCELLED:
            raise serializers.ValidationError('Invalid data.')

        return attrs

    def update(self, instance, validated_data):
        instance.is_active = False
        instance.status = AGENT_APP_STATUS.CANCELLED
        instance.date_reviewed = timezone.now()
        instance.save()
        return instance


class AgentAccountListSerializer(serializers.ModelSerializer):
    user = UserRetrieveSerializer()

    class Meta:
        model = AgentAccount
        fields = ['pk', 'user', 'agent_name', 'bio', 'profile_image_path']


class AgentAccountUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentAccount
        fields = ['agent_name', 'bio', 'profile_image_path']


class AgentAccountRetrieveSerializer(serializers.ModelSerializer):
    user = UserRetrieveSerializer()
    pk = serializers.SerializerMethodField()

    class Meta:
        model = AgentAccount
        fields = '__all__'

    def get_pk(self, obj):
        return obj.pk
