from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email_verification_pin = models.CharField(
        max_length=100, null=True, blank=True)


class PasswordResetRequest(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=180)
    created_at = models.DateTimeField(auto_now_add=True)


class EmailValidationRequest(models.Model):
    email = models.EmailField()
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    pin_code = models.IntegerField(
        validators=[MinValueValidator(100000), MaxValueValidator(999999)], error_messages={"error": "Invalid PIN"})
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
