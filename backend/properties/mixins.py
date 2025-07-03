from django.db.models import Q

from .serializers import PropertyQuerySerializer
from .models import PROPERTY_TYPE, PROPERTY_STATUS, SORT_OPTIONS


class PropertyQueryFiltersMixin:
    def filter_by_default_queries(self, properties, filters=Q()):
        query_serializer = PropertyQuerySerializer(data=self.request.GET)
        query_serializer.is_valid(raise_exception=True)
        validated_data = query_serializer.validated_data

        property_type = validated_data.get('property_type')
        status = validated_data.get('status')
        sort_by = validated_data.get('sort_by')

        if property_type in dict(PROPERTY_TYPE.CHOICES):
            filters &= Q(property_type=property_type)
        if status in dict(PROPERTY_STATUS.CHOICES):
            filters &= Q(status=status)

        properties = properties.filter(filters)
        properties = properties.order_by(SORT_OPTIONS.get(sort_by))

        return properties
