from django.db import models
from .models import User


def get_listing_types():
    return [("FS", "For Sale"), ("FR", "For Rent"), ("FC", "Foreclosure")]


def get_property_types():
    return [("HL", "House and Lot"), ("CL", "Commercial Lot"), ("RL", "Residential Lot"), ("CO", "Condominium")]


class Listing(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    listing_type = models.CharField(choices=get_listing_types)
    property_type = models.CharField(choices=get_property_types)
    price = models.PositiveIntegerField()
    image = models.ImageField(blank=True, null=True)
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
