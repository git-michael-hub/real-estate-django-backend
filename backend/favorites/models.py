from django.contrib.auth.models import User
from django.db import models
from listings.models import Listing


class Favorites(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='favorites')
    listings = models.ManyToManyField(Listing)
