from django.contrib.auth.models import User
from django.core.validators import validate_image_file_extension
from django.db import models

from users.models import User


def upload_to(instance, filename):
    return 'images/%d/seller_account/' % (instance.id, filename)


class SellerAccount(models.Model):
    user = models.OneToOneField(
        User, related_name='seller_account', on_delete=models.CASCADE, primary_key=True)
    business_name = models.CharField(max_length=100)
    business_address = models.CharField(max_length=500)
    contact_number_1 = models.BigIntegerField(blank=True, null=True)
    contact_number_2 = models.BigIntegerField(blank=True, null=True)
    profile_image_path = models.ImageField(
        upload_to=upload_to, validators=[validate_image_file_extension], blank=True, null=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=False)
    date_approved = models.DateTimeField(blank=True, null=True)


class SellerApplication(models.Model):
    STATUS_CHOICES = [('A', 'Approved'), ('R', 'Rejected'), ('P', 'Pending')]

    seller_account = models.ForeignKey(
        SellerAccount, related_name='seller_application', on_delete=models.CASCADE)
    business_name = models.CharField(max_length=100)
    business_address = models.CharField(max_length=500)
    status = models.CharField(
        max_length=100, choices=STATUS_CHOICES, default=STATUS_CHOICES[2])
    application_date = models.DateTimeField(auto_now_add=True)
    date_reviewed = models.DateTimeField(blank=True, null=True)
