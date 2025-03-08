import datetime

from django.core.validators import validate_image_file_extension
from django.db import models

from users.models import User


def upload_to(instance, filename):
    return f"images/users/{instance.id}/agent_account/{filename}"


class AgentAccount(models.Model):
    user = models.OneToOneField(
        User,
        related_name='agent_account',
        on_delete=models.CASCADE,
        primary_key=True
    )
    agent_name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    profile_image_path = models.ImageField(
        upload_to=upload_to,
        validators=[validate_image_file_extension],
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=False)
    date_approved = models.DateTimeField(blank=True, null=True)

    def has_active_application(self):
        for application in self.agent_applications.all():
            if application.is_active:
                return True
        return False

    def cancel_active_applications(self):
        for application in self.agent_applications.all():
            if application.is_active:
                application.is_active = False
                application.status = 'C'
                application.date_reviewed = datetime.datetime.now()
                application.save()


class AgentApplication(models.Model):
    STATUS_CHOICES = [('A', 'Approved'), ('R', 'Rejected'),
                      ('P', 'Pending'), ('C', 'Cancelled')]

    agent_account = models.ForeignKey(
        AgentAccount,
        related_name='agent_applications',
        on_delete=models.CASCADE
    )
    license_number = models.CharField(max_length=100)
    license_document_path = models.CharField(max_length=100)
    status = models.CharField(
        max_length=100,
        choices=STATUS_CHOICES,
        default=STATUS_CHOICES[2]
    )
    application_date = models.DateTimeField(auto_now_add=True)
    date_reviewed = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
