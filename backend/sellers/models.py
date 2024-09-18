from django.contrib.auth.models import User
from django.core.validators import validate_image_file_extension
from django.db import models


def upload_to(instance, filename):
    return 'images/sellers/' % (instance.user.seller_account.id, filename)


class SellerApplication(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]

    user = models.OneToOneField(
        User, related_name='seller_account', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    address = models.CharField(max_length=500)
    birthdate = models.DateField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    contact_number_1 = models.PositiveIntegerField()
    contact_number_2 = models.PositiveIntegerField(blank=True, null=True)

    seller_image_url = models.ImageField(
        upload_to=upload_to, validators=[validate_image_file_extension])
    valid_id_url = models.ImageField(
        upload_to=upload_to, validators=[validate_image_file_extension])

    created_at = models.DateTimeField(auto_now_add=True)

# class SellerAccount(SellerApplication):
