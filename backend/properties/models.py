from django.core.validators import validate_image_file_extension
from django.db import models

from sellers.models import SellerAccount


def upload_to(instance, filename):
    return f"images/properties/{instance.id}/{filename}"


class Property(models.Model):
    PROPERTY_TYPES = [("HL", "House and Lot"), ("CL", "Commercial Lot"),
                      ("RL", "Residential Lot"), ("CO", "Condominium")]

    seller_account = models.ForeignKey(
        SellerAccount, related_name='properties', on_delete=models.CASCADE)
    property_type = models.CharField(choices=PROPERTY_TYPES, max_length=20)
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    barangay = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    lot_area = models.PositiveIntegerField(blank=True, null=True)
    floor_area = models.PositiveIntegerField(blank=True, null=True)
    num_of_floors = models.PositiveIntegerField(blank=True, null=True)
    bedrooms = models.PositiveIntegerField(blank=True, null=True)
    bathrooms = models.PositiveIntegerField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    image1_path = models.ImageField(
        blank=True,
        null=True,
        upload_to=upload_to,
        validators=[validate_image_file_extension]
    )
    image2_path = models.ImageField(
        blank=True,
        null=True,
        upload_to=upload_to,
        validators=[validate_image_file_extension]
    )
    image3_path = models.ImageField(
        blank=True,
        null=True,
        upload_to=upload_to,
        validators=[validate_image_file_extension]
    )
    image4_path = models.ImageField(
        blank=True,
        null=True,
        upload_to=upload_to,
        validators=[validate_image_file_extension]
    )
    image5_path = models.ImageField(
        blank=True,
        null=True,
        upload_to=upload_to,
        validators=[validate_image_file_extension]
    )

    is_deleted = models.BooleanField(default=False)

    EDITABLE_FIELDS = {'before_listing': ['property_type', 'province', 'city', 'barangay', 'street',
                                          'lot_area', 'floor_area', 'num_of_floors', 'bedrooms', 'bathrooms',
                                          'image1_path', 'image2_path', 'image3_path', 'image4_path', 'image5_path'],
                       'after_listing': ['image1_path', 'image2_path', 'image3_path', 'image4_path', 'image5_path']
                       }

    def has_listings(self):
        return self.listings.count() > 0
