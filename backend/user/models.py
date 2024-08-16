from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Roles(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='user_roles')
    is_buyer = models.BooleanField(default=True)
    is_seller = models.BooleanField(default=False)
    is_agent = models.BooleanField(default=False)


class PasswordResetRequest(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=180)
    created_at = models.DateTimeField(auto_now_add=True)


class EmailVerificationRequest(models.Model):
    email = models.EmailField()
    pin = models.IntegerField(
        validators=[MinValueValidator(100000), MaxValueValidator(999999)], error_messages={"error": "Invalid PIN"})
    created_at = models.DateField(auto_now_add=True)
