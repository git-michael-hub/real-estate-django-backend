from django.db import models

from properties.models import Property
from sellers.models import SellerAccount
from agents.models import AgentAccount


class LISTING_STATUS:
    ACTIVE = 'A'
    HOLD = 'H'
    SOLD = 'S'
    CANCELLED = 'C'
    REMOVED = 'R'

    CHOICES = [
        (ACTIVE, 'Active'),
        (HOLD, 'On Hold'),
        (SOLD, 'Sold'),
        (CANCELLED, 'Cancelled'),
        (REMOVED, 'Removed')
    ]

    def get_dict():
        return dict(LISTING_STATUS.CHOICES)


class LISTING_TYPE:
    FOR_SALE = 'FS'
    FOR_RENT = 'FR'
    FORECLOSURE = 'FC'

    CHOICES = [
        (FOR_SALE, 'For Sale'),
        (FOR_RENT, 'For Rent'),
        (FORECLOSURE, 'Foreclosure')
    ]


class SORT_OPTIONS:
    A_TO_Z = 'ATZ'
    Z_TO_A = 'ZTA'
    OLD_TO_NEW = 'OTN'
    NEW_TO_OLD = 'NTO'

    CHOICES = [
        (A_TO_Z, 'title'),
        (Z_TO_A, '-title'),
        (OLD_TO_NEW, 'created_at'),
        (NEW_TO_OLD, '-created_at')
    ]

    def get(choice, default='-created_at'):
        return dict(SORT_OPTIONS.CHOICES).get(choice, default)


class Listing(models.Model):

    property = models.ForeignKey(Property,
                                 related_name="listings",
                                 on_delete=models.CASCADE)

    agent_account = models.ForeignKey(AgentAccount,
                                      related_name='listings',
                                      blank=True,
                                      null=True,
                                      on_delete=models.CASCADE)

    listing_type = models.CharField(choices=LISTING_TYPE.CHOICES,
                                    max_length=20)

    title = models.CharField(max_length=100)
    price = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(max_length=100,
                              choices=LISTING_STATUS.CHOICES,
                              default=LISTING_STATUS.ACTIVE)
