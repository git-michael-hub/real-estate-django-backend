from django.db import models

from offers.models import Offer


class TRANSACTION_STATUS:
    PENDING = 'P'
    IN_PROCESS = 'IP'
    COMPLETED = 'CO'
    CANCELLED = 'CA'

    CHOICES = [
        (PENDING, 'Pending'),
        (IN_PROCESS, 'In Process'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled')
    ]

    def get_dict():
        return dict(TRANSACTION_STATUS.CHOICES)

    def get_keys():
        return list(TRANSACTION_STATUS.get_dict().keys())

    def get_str_name(key):
        keys = TRANSACTION_STATUS.get_keys()

        if key not in keys:
            key_list_str = ', '.join(f"'{key_str}'" for key_str in keys)
            raise KeyError(
                f"Expected key to be in {key_list_str}. Got {key} instead.")

        return TRANSACTION_STATUS.get_dict()[key]


class Transaction(models.Model):
    offer = models.OneToOneField(Offer,
                                 related_name='transaction',
                                 on_delete=models.CASCADE)

    status = models.CharField(max_length=100,
                              choices=TRANSACTION_STATUS.CHOICES,
                              default=TRANSACTION_STATUS.PENDING)

    date_created = models.DateTimeField(auto_now_add=True)
