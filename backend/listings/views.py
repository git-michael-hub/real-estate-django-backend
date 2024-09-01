from rest_framework import generics, authentication
from rest_framework.response import Response
from .serializers import ListingSerializer, ListingQuerySerializer, ListingDetailSerializer
from .models import Listing


class ListingCreateView(generics.CreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    authentication_classes = [authentication.TokenAuthentication]


listing_create_view = ListingCreateView.as_view()


class ListingListView(generics.ListAPIView):

    def list(self, request):
        query_serializer = ListingQuerySerializer(data=request.GET)
        query_serializer.is_valid(raise_exception=True)

        property_type = request.GET.get('property_type')
        listing_type = request.GET.get('listing_type')
        province = request.GET.get('province')
        city = request.GET.get('city')
        min_price = request.GET.get('min_price')
        if (min_price is None or min_price == ''):
            min_price = 0
        max_price = request.GET.get('max_price')
        min_area = request.GET.get('min_area')
        if (min_area is None or min_area == ''):
            min_area = 0
        max_area = request.GET.get('max_area')

        listings = Listing.objects.all()

        if property_type == 'HL' or property_type == 'CL' or property_type == 'RL' or property_type == 'CO':
            listings = listings.filter(property_type=property_type)
        if listing_type == 'FS' or listing_type == 'FR' or listing_type == 'FC':
            listings = listings.filter(listing_type=listing_type)
        if province:
            listings = listings.filter(province__icontains=province)
        if city:
            listings = listings.filter(city__icontains=city)
        if max_price:
            listings = listings.filter(
                price__gte=min_price, price__lte=max_price)
        else:
            listings = listings.filter(
                price__gte=min_price)
        if max_area:
            listings = listings.filter(
                property_size__gte=min_area, property_size__lte=max_area)
        else:
            listings = listings.filter(
                property_size__gte=min_area)

        listings_serializer = ListingSerializer(
            listings, many=True, context={'request': request})
        return Response(listings_serializer.data)


listing_list_view = ListingListView.as_view()


class ListingDetailView(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingDetailSerializer
    lookup_field = 'pk'


listing_detail_view = ListingDetailView.as_view()


############ DEVELOPMENT ONLY ####################


class ListingTestListView(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
