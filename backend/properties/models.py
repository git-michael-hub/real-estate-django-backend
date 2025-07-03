from django.core.validators import validate_image_file_extension
from django.db import models

from sellers.models import SellerAccount


class PROPERTY_TYPE:
    HOUSE_AND_LOT = 'HL'
    COMMERCIAL_LOT = 'CL'
    RESIDENTAIL_LOT = 'RL'
    CONDOMINIUM = 'CO'

    CHOICES = [
        (HOUSE_AND_LOT, 'House and Lot'),
        (COMMERCIAL_LOT, 'Commercial Lot'),
        (RESIDENTAIL_LOT, 'Residentail Lot'),
        (CONDOMINIUM, 'Condominium')
    ]


class PROPERTY_STATUS:
    READY_FOR_LISTING = 'R'
    LISTED = 'L'
    HOLD = 'H'
    SOLD = 'S'

    CHOICES = [
        (READY_FOR_LISTING, 'Ready for Listing'),
        (LISTED, 'Listed'),
        (HOLD, 'On Hold'),
        (SOLD, 'Sold')
    ]

    def get_values():
        return [PROPERTY_STATUS.READY_FOR_LISTING, PROPERTY_STATUS.LISTED, PROPERTY_STATUS.HOLD, PROPERTY_STATUS.SOLD]


def upload_to(instance, filename):
    return f"images/properties/{instance.id}/{filename}"


class SORT_OPTIONS:
    A_TO_Z = 'ATZ'
    Z_TO_A = 'ZTA'
    OLD_TO_NEW = 'OTN'
    NEW_TO_OLD = 'NTO'

    CHOICES = [
        (A_TO_Z, 'street'),
        (Z_TO_A, '-street'),
        (OLD_TO_NEW, 'date_created'),
        (NEW_TO_OLD, '-date_created')
    ]

    def get(choice, default='-date_created'):
        return dict(SORT_OPTIONS.CHOICES).get(choice, default)


class Property(models.Model):

    seller_account = models.ForeignKey(
        SellerAccount, related_name='properties', on_delete=models.CASCADE)
    property_type = models.CharField(
        choices=PROPERTY_TYPE.CHOICES, max_length=20)
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

    status = models.CharField(
        max_length=100,
        choices=PROPERTY_STATUS.CHOICES,
        default=PROPERTY_STATUS.READY_FOR_LISTING
    )

    is_deleted = models.BooleanField(default=False)

    EDITABLE_FIELDS = {
        'before_listing': ['property_type', 'province', 'city', 'barangay', 'street',
                           'lot_area', 'floor_area', 'num_of_floors', 'bedrooms', 'bathrooms',
                           'image1_path', 'image2_path', 'image3_path', 'image4_path', 'image5_path'],
        'after_listing': ['image1_path', 'image2_path', 'image3_path', 'image4_path', 'image5_path']
    }

    def get_address(self):
        address = ''
        if self.street:
            address += f'{self.street}, '
        if self.barangay:
            address += f'{self.barangay}, '
        address += f'{self.city}, {self.province}'
        return address

    def is_property_agent(self, agent_account):
        return self.assigned_agents.filter(agent=agent_account).exists()

    def is_property_seller(self, seller_account):
        return self.seller_account == seller_account

    def can_list_this_property(self, user):
        return (self.is_property_agent(agent_account=user.agent_account) or
                self.is_property_seller(seller_account=user.seller_account))

    def update_all_listing_status(self, status, excluded_listing_pk=None):
        if excluded_listing_pk is None:
            self.listings.all().update(status=status)
            return

        if isinstance(excluded_listing_pk, int):
            self.listings.exclude(pk=excluded_listing_pk).update(status=status)
            return

        raise TypeError(
            f"Expected excluded_listing_pk to be of type 'None' or 'int' but got '{type(excluded_listing_pk).__name__}'")

    def update_status(self, status):
        if status in PROPERTY_STATUS.get_values():
            self.status = status
            self.save()
            return
        raise ValueError(
            f"Expected one of the following: {PROPERTY_STATUS.get_values()}. Got {status} instead.")
