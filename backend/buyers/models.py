from django.core.validators import validate_image_file_extension
from django.db import models

from listings.models import Listing

from users.models import User


def upload_to(instance, filename):
    return f"images/users/{instance.user.pk}/buyer_account/{filename}"


class BuyerAccount(models.Model):
    user = models.OneToOneField(
        User, related_name='buyer_account', on_delete=models.CASCADE, primary_key=True)
    profile_image_path = models.ImageField(
        upload_to=upload_to, validators=[validate_image_file_extension], blank=True, null=True)
    bio = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"


class WishlistEntry(models.Model):
    buyer_account = models.ForeignKey(
        BuyerAccount, related_name='wishlist', on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)
