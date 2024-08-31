from django.db import models
from django.contrib.auth.models import User


class Listing(models.Model):
    LISTING_TYPES = [("FS", "For Sale"), ("FR", "For Rent"),
                     ("FC", "Foreclosure")]

    PROPERTY_TYPES = [("HL", "House and Lot"), ("CL", "Commercial Lot"),
                      ("RL", "Residential Lot"), ("CO", "Condominium")]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    listing_type = models.CharField(choices=LISTING_TYPES, max_length=20)
    property_type = models.CharField(choices=PROPERTY_TYPES, max_length=20)
    price = models.PositiveIntegerField()
    image = models.ImageField(blank=True, null=True,
                              upload_to='images/listings')
    property_size = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(blank=True)
    is_available = models.BooleanField(default=False)

    # Only for House and Lot and Condominuim property types
    bedrooms = models.PositiveIntegerField(blank=True, null=True)
    bathrooms = models.PositiveIntegerField(blank=True, null=True)

    # For listing location
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    baranggay = models.CharField(max_length=100)
    street = models.CharField(max_length=100)

    def get_location(self):
        return f"{self.province}, {self.city}, {self.baranggay}, {self.street}"

    def __str__(self):
        return self.title
