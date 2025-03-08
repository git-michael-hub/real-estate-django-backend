from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email_verification_pin = models.CharField(
        max_length=100, null=True, blank=True)

    def is_seller(self):
        return self.seller_account.is_active


class PasswordResetRequest(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=180)
    created_at = models.DateTimeField(auto_now_add=True)
