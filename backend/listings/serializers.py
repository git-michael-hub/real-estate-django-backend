from rest_framework import serializers
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):

    listing_type_display = serializers.SerializerMethodField()
    property_type_display = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = '__all__'

    # FIND WAY TO MAKE THIS DRY
    def validate_bathrooms(self, value):
        property_type = self.context['request'].POST.get('property_type')
        if (property_type == 'CO' or property_type == 'HL'):
            return value
        else:
            if (value != None):
                raise serializers.ValidationError(
                    'Only House and Lot and Condominuim property type can have a "bathrooms" property.')
            return value

    # FIND WAY TO MAKE THIS DRY
    def validate_bedrooms(self, value):
        property_type = self.context['request'].POST.get('property_type')
        if (property_type == 'CO' or property_type == 'HL'):
            return value
        else:
            if (value != None):
                raise serializers.ValidationError(
                    'Only House and Lot and Condominuim property type can have a "bedrooms" property.')
            return value

    def get_listing_type_display(self, obj):
        return obj.get_listing_type_display()

    def get_property_type_display(self, obj):
        return obj.get_property_type_display()


class ListingDetailSerializer(ListingSerializer):

    class Meta(ListingSerializer.Meta):
        fields = ListingSerializer.Meta.fields
        depth = 1


class ListingQuerySerializer(serializers.Serializer):
    listing_type = serializers.ChoiceField(choices=Listing.LISTING_TYPES)
    property_type = serializers.ChoiceField(choices=Listing.PROPERTY_TYPES)
    province = serializers.CharField(max_length=100, required=False)
    city = serializers.CharField(max_length=100, required=False)
    min_price = serializers.IntegerField(required=False)
    max_price = serializers.IntegerField(required=False)
    min_area = serializers.IntegerField(required=False)
    max_area = serializers.IntegerField(required=False)

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
