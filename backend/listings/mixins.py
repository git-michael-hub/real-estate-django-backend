from rest_framework import status
from rest_framework.response import Response

from .models import LISTING_STATUS


class ListingDestroyMixin:
    def destroy(self, request, *args, **kwargs):
        listing = self.get_object()
        err_message = f"Cannot delete listing with ('{listing.status}', '{LISTING_STATUS.get_dict()[listing.status]}') status."
        if listing.status != LISTING_STATUS.ACTIVE:
            return Response({"error": err_message}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_destroy(listing)
        return Response(status=status.HTTP_204_NO_CONTENT)
