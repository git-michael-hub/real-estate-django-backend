from django.db.models import Q

from rest_framework import status
from rest_framework.response import Response

from properties.models import PROPERTY_TYPE

from .models import LISTING_STATUS, LISTING_TYPE, SORT_OPTIONS, Listing
from .serializers import ListingQuerySerializer


class ListingDestroyMixin:
    def destroy(self, request, *args, **kwargs):
        listing = self.get_object()
        err_message = f"Cannot delete listing with ('{listing.status}', '{LISTING_STATUS.get_dict()[listing.status]}') status."
        if listing.status != LISTING_STATUS.ACTIVE:
            return Response({"error": err_message}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_destroy(listing)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ListingQueryFiltersMixin:
    def filter_by_default_queries(self, listings, filters=Q()):
        query_serializer = ListingQuerySerializer(data=self.request.GET)
        query_serializer.is_valid(raise_exception=True)
        validated_data = query_serializer.validated_data

        property = validated_data.get('property')
        seller_username = validated_data.get('seller_username')
        agent_username = validated_data.get('agent_username')
        property_type = validated_data.get('property_type')
        listing_type = validated_data.get('listing_type')
        status = validated_data.get('status')

        province = validated_data.get('province')
        city = validated_data.get('city')
        min_price = validated_data.get('min_price', 0)
        max_price = validated_data.get('max_price')
        min_area = validated_data.get('min_area', 0)
        max_area = validated_data.get('max_area')
        sort_by = validated_data.get('sort_by')

        if property:
            filters &= Q(property=property)
        if seller_username:
            filters &= Q(agent_account__isnull=True,
                         property__seller_account__user__username=seller_username)
        if agent_username:
            filters &= Q(agent_account__user__username=agent_username)
        if property_type in dict(PROPERTY_TYPE.CHOICES):
            filters &= Q(property__property_type=property_type)
        if listing_type in dict(LISTING_TYPE.CHOICES):
            filters &= Q(listing_type=listing_type)
        if status in dict(LISTING_STATUS.CHOICES):
            filters &= Q(status=status)
        if province:
            filters &= Q(property__province__icontains=province)
        if city:
            filters &= Q(property__city__icontains=city)
        if max_price is not None:
            filters &= Q(price__lte=max_price)
        if min_price is not None:
            filters &= Q(price__gte=min_price)

        if property_type == PROPERTY_TYPE.CONDOMINIUM:
            if max_area is not None:
                filters &= Q(property__floor_area__lte=max_area)
            if min_area is not None:
                filters &= Q(property__floor_area__gte=min_area)
        else:
            if max_area is not None:
                filters &= (Q(property__lot_area__lte=max_area)
                            | Q(property__floor_area__lte=max_area, property__property_type=PROPERTY_TYPE.CONDOMINIUM))
            if min_area is not None:
                filters &= (Q(property__lot_area__gte=min_area)
                            | Q(property__floor_area__gte=min_area, property__property_type=PROPERTY_TYPE.CONDOMINIUM))

        listings = listings.filter(filters)
        listings = listings.order_by(SORT_OPTIONS.get(sort_by))

        return listings
