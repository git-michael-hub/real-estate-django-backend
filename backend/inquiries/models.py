from django.db import models
from django.contrib.auth.models import User
from listings.models import Listing


class Inquiries(models.Model):
    recipient = models.ForeignKey(
        User, related_name='inbox', on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.DO_NOTHING)
    sender_name = models.CharField(max_length=100)
    email = models.EmailField()
    contact_number = models.PositiveIntegerField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Notifications(models.Model):
    user = models.ForeignKey(
        User, related_name='notifications', on_delete=models.CASCADE)
    text = models.CharField(max_length=500)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
