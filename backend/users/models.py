from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    email_verification_pin = models.CharField(
        max_length=100, null=True, blank=True)

    def is_seller(self):
        return self.seller_account.is_active

    def is_agent(self):
        return self.agent_account.is_active


class PasswordResetRequest(models.Model):
    user = models.ForeignKey(
        User, related_name='password_reset_requests', on_delete=models.CASCADE)
    token = models.CharField(max_length=180)
    created_at = models.DateTimeField(auto_now_add=True)
