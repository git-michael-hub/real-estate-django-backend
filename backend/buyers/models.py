from django.core.validators import validate_image_file_extension
from django.db import models

from listings.models import Listing

from users.models import User


def upload_to(instance, filename):
    return 'images/%d/buyer_account/' % (instance.id, filename)


class BuyerAccount(models.Model):
    user = models.OneToOneField(
        User, related_name='buyer_account', on_delete=models.CASCADE, primary_key=True)
    profile_image_path = models.ImageField(
        upload_to=upload_to, validators=[validate_image_file_extension], blank=True, null=True)
    bio = models.CharField(max_length=500, blank=True)
    wishlist = models.ManyToManyField(Listing)
