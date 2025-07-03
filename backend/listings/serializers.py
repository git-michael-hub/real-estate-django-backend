from rest_framework import serializers

from agents.serializers import AgentAccountListSerializer

from properties.models import Property, PROPERTY_TYPE
from properties.serializers import PropertyListSerializer

from .models import Listing, LISTING_STATUS, LISTING_TYPE, SORT_OPTIONS


class ListingListSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer()
    agent_account = AgentAccountListSerializer(allow_null=True)
    listing_type_display = serializers.SerializerMethodField(read_only=True)
    status_display = serializers.SerializerMethodField(read_only=True)
    created_at = serializers.DateTimeField(
        format="%B %d, %Y", read_only=True)

    class Meta:
        model = Listing
        fields = '__all__'

    def get_listing_type_display(self, obj):
        return obj.get_listing_type_display()

    def get_status_display(self, obj):
        return obj.get_status_display()


class ListingRetrieveSerializer(ListingListSerializer):
    class Meta(ListingListSerializer.Meta):
        fields = ListingListSerializer.Meta.fields


class ListingQuerySerializer(serializers.Serializer):
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(), required=False)
    seller_username = serializers.CharField(max_length=100, required=False)
    agent_username = serializers.CharField(max_length=100, required=False)
    listing_type = serializers.ChoiceField(
        choices=LISTING_TYPE.CHOICES, required=False)
    property_type = serializers.ChoiceField(
        choices=PROPERTY_TYPE.CHOICES, required=False)
    status = serializers.ChoiceField(
        choices=LISTING_STATUS.CHOICES, required=False)
    province = serializers.CharField(max_length=100, required=False)
    city = serializers.CharField(max_length=100, required=False)
    min_price = serializers.IntegerField(required=False)
    max_price = serializers.IntegerField(required=False)
    min_area = serializers.IntegerField(required=False)
    max_area = serializers.IntegerField(required=False)
    sort_by = serializers.ChoiceField(
        choices=SORT_OPTIONS.CHOICES, required=False)

    def validate(self, data):
        max_price = data.get('max_price')
        min_price = data.get('min_price')
        if min_price and max_price and min_price > max_price:
            raise serializers.ValidationError(
                "Max Price should be greater than or equal to Min Price.")

        max_area = data.get('max_area')
        min_area = data.get('min_area')
        if min_area and max_area and min_area > max_area:
            raise serializers.ValidationError(
                "Max Area should be greater than or equal to Min Area.")

        return data


class SellerListingCreateSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(), required=True)

    class Meta:
        model = Listing
        fields = '__all__'

    def validate(self, attrs):
        user = self.context['request'].user
        property_instance = attrs.get('property')

        if not property_instance.can_list_this_property(user):
            raise serializers.ValidationError(
                'User is not an allowed to create listing for this property.')

        return attrs


class AgentListingCreateSerializer(SellerListingCreateSerializer):
    class Meta(SellerListingCreateSerializer.Meta):
        fields = SellerListingCreateSerializer.Meta.fields

    def validate(self, attrs):
        agent_account = self.context['request'].user.agent_account
        attrs['agent_account'] = agent_account
        return super().validate(attrs)


class ListingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['title', 'price', 'description']

    def validate(self, attrs):
        if self.instance.status != LISTING_STATUS.ACTIVE:
            raise serializers.ValidationError(
                f"Listing with status '{self.instance.status}' is not editable.")

        return attrs
