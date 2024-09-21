from rest_framework import generics
from rest_framework.response import Response
from .serializers import ListingSerializer, ListingQuerySerializer, ListingDetailSerializer
from .models import Listing
from .permissions import IsOwnerOrReadOnly, IsSellerOrReadOnly


class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsSellerOrReadOnly]

    def list(self, request):
        query_serializer = ListingQuerySerializer(data=request.GET)
        query_serializer.is_valid(raise_exception=True)

        username = request.GET.get('username')
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

        listings = self.get_queryset()

        if username:
            listings = listings.filter(owner__username=username)
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


listing_list_create_view = ListingListCreateView.as_view()


class ListingDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'id'


listing_detail_update_delete_view = ListingDetailUpdateDeleteView.as_view()
