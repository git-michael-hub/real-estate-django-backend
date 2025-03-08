import datetime

from rest_framework import serializers, status, exceptions

from .models import AgentAccount, AgentApplication


class AgentApplicationCreateSerialier(serializers.ModelSerializer):
    class Meta:
        model = AgentApplication
        fields = ['agent_name', 'license_number', 'license_document_path']

    def validate(self, attrs):
        user = self.context['request'].user
        if user.agent_account.is_active:
            raise serializers.ValidationError(
                'Account already have an active agent_account.', status.HTTP_400_BAD_REQUEST)

        if user.agent_account.has_active_applications():
            user.agent_account.cancel_active_applications()

        return attrs

    def create(self, validated_data):
        user = self.context.get('request').user
        validated_data['user'] = user
        return AgentApplication.objects.create(**validated_data)


class AgentApplicationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentApplication
        fields = ['id', 'status', 'application_date']


class AgentApplicationRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentApplication
        fields = '__all__'


class AgentApplicationCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentApplication
        fields = ['status']

    def validate(self, attrs):
        if attrs.get('status') in ['A', 'R', 'P']:
            raise exceptions.PermissionDenied(
                'Only Admin is allowed to update Agent Application.', status.HTTP_403_FORBIDDEN)
        if attrs.get('status') != 'C':
            raise serializers.ValidationError(
                'Invalid data.', status.HTTP_400_BAD_REQUEST)
        return attrs

    def update(self, instance, validated_data):
        instance.is_active = False
        instance.status = 'C'
        instance.date_reviewed = datetime.datetime.now()
        instance.save()
        return instance


class AgentAccountListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentAccount
        fields = '__all__'


class AgentAccountUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentAccount
        fields = ['agent_name', 'bio', 'profile_image_path']


class AgentAccountRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentAccount
        fields = '__all__'
