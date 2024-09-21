from django.contrib.auth.models import User
from django.core.validators import validate_image_file_extension
from django.db import models

from users.models import EmailValidationRequest


def upload_to(instance, filename):
    return 'images/sellers/' % (instance.id, filename)


class SellerRequirements(EmailValidationRequest):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    address = models.CharField(max_length=500)
    birthdate = models.DateField(editable=False, blank=True, null=True)
    gender = models.CharField(
        max_length=20, editable=False, blank=True, null=True, choices=GENDER_CHOICES)
    contact_number_1 = models.PositiveIntegerField()
    contact_number_2 = models.PositiveIntegerField(blank=True, null=True)

    seller_image_url = models.ImageField(
        upload_to=upload_to, validators=[validate_image_file_extension], blank=True, null=True, editable=False)
    valid_id_url = models.ImageField(
        upload_to=upload_to, validators=[validate_image_file_extension], blank=True, null=True, editable=False)

    class Meta:
        abstract = True


class SellerEmailValidationRequest(SellerRequirements):
    pass


class SellerApplication(SellerRequirements):
    STATUS_CHOICES = [('A', 'Approved'), ('R', 'Rejected'), ('P', 'Pending')]

    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default=STATUS_CHOICES[2])
    application_date = models.DateTimeField(auto_now_add=True)

    created_at = None
    pin_code = None


class SellerAccount(SellerApplication):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]
    STATUS_CHOICES = [('A', 'Approved'), ('R', 'Rejected'), ('P', 'Pending')]

    user = models.OneToOneField(
        User, related_name='seller_account', on_delete=models.CASCADE)

    date_joined = models.DateTimeField(auto_now_add=True)
