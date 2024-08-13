from django.db import models


class PasswordReset(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=180)
    created_at = models.DateTimeField(auto_now_add=True)
