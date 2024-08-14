from django.db import models


class PasswordResetRequest(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=180)
    created_at = models.DateTimeField(auto_now_add=True)


class EmailVerificationRequest(models.Model):
    email = models.EmailField()
    pin = models.IntegerField()
