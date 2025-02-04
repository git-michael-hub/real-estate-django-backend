from rest_framework import serializers


class InquiriesSerializer(serializers.Serializer):
    agent_email = serializers.EmailField()
    sender_name = serializers.CharField(max_length=100)
    sender_email = serializers.EmailField()
    sender_contact_number = serializers.IntegerField()
    message = serializers.CharField(max_length=1000)
    listing_id = serializers.IntegerField(required=False)
