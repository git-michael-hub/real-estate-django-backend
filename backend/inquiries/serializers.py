from rest_framework import serializers
from .models import Inquiries


class InquiriesListCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Inquiries
        fields = '__all__'
        read_only_fields = ['is_read']


class InquriesDetailEditDeleteSerializer(InquiriesListCreateSerializer):
    class Meta(InquiriesListCreateSerializer.Meta):
        fields = InquiriesListCreateSerializer.Meta.fields
        read_only_fields = ['recipient', 'listing', 'sender_name',
                            'email', 'contact_number', 'message', 'created_at']
