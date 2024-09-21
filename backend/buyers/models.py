from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.db import models

from listings.models import Listing

from users.models import EmailValidationRequest


class BuyerEmailValidationRequest(EmailValidationRequest):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)


class BuyerAccount(models.Model):
    user = models.OneToOneField(
        User, related_name='buyer_account', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    bio = models.CharField(max_length=500, blank=True)
    contact_number_1 = models.PositiveIntegerField(blank=True, null=True)
    contact_number_2 = models.PositiveIntegerField(blank=True, null=True)
    favorite_listings = models.ManyToManyField(Listing)
    date_joined = models.DateTimeField(auto_now_add=True)
