from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator, validate_image_file_extension
from django.db import models


class NewSellerApplication(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class SellerProfile(models.Model):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]

    user = models.OneToOneField(
        User, related_name='seller', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    address = models.CharField(max_length=500)
    birthdate = models.DateField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    contact_number_1 = models.PositiveIntegerField()
    contact_number_2 = models.PositiveIntegerField(blank=True, null=True)
    valid_id = models.ImageField(
        upload_to='images/seller_application', validators=[validate_image_file_extension])
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)


class PasswordResetRequest(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=180)
    created_at = models.DateTimeField(auto_now_add=True)


class EmailVerificationRequest(models.Model):
    email = models.EmailField()
    pin = models.IntegerField(
        validators=[MinValueValidator(100000), MaxValueValidator(999999)], error_messages={"error": "Invalid PIN"})
    created_at = models.DateTimeField(auto_now_add=True)
