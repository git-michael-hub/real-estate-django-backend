import datetime

from django.contrib.auth.models import User
from django.core.validators import validate_image_file_extension
from django.db import models

from users.models import User


def upload_to(instance, filename):
    return f"images/users/{instance.user.id}/seller_account/{filename}"


class SELLER_APP_STATUS:
    APPROVED = "A"
    PENDING = "P"
    REJECTED = "R"
    CANCELLED = "C"

    CHOICES = [
        (APPROVED, "Approved"),
        (PENDING, "Pending"),
        (REJECTED, "Rejected"),
        (CANCELLED, "Cancelled"),
    ]


class SellerAccount(models.Model):
    user = models.OneToOneField(
        User,
        related_name='seller_account',
        on_delete=models.CASCADE,
        primary_key=True
    )
    business_name = models.CharField(max_length=100)
    business_address = models.CharField(max_length=500)
    contact_number_1 = models.BigIntegerField(blank=True, null=True)
    contact_number_2 = models.BigIntegerField(blank=True, null=True)
    profile_image_path = models.ImageField(
        upload_to=upload_to,
        validators=[validate_image_file_extension],
        blank=True,
        null=True
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=False)
    date_approved = models.DateTimeField(blank=True, null=True)

    def has_active_application(self):
        for application in self.seller_applications.all():
            if application.is_active:
                return True
        return False

    def cancel_active_applications(self):
        for application in self.seller_applications.all():
            if application.is_active:
                application.is_active = False
                application.status = 'C'
                application.date_reviewed = datetime.datetime.now()
                application.save()


class SellerApplication(models.Model):

    seller_account = models.ForeignKey(
        SellerAccount,
        related_name='seller_applications',
        on_delete=models.CASCADE
    )
    business_name = models.CharField(max_length=100)
    business_address = models.CharField(max_length=500)
    status = models.CharField(
        max_length=100,
        choices=SELLER_APP_STATUS.CHOICES,
        default=SELLER_APP_STATUS.PENDING
    )
    application_date = models.DateTimeField(auto_now_add=True)
    date_reviewed = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
