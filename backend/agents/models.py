import datetime

from django.core.validators import validate_image_file_extension
from django.db import models

from users.models import User


def upload_profile_image(instance, filename):
    return f"images/users/{instance.user.id}/agent_account/{filename}"


def upload_license_document(instance, filename):
    return f"images/users/{instance.agent_account.user.id}/agent_account/{filename}"


class AGENT_APP_STATUS:
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
        upload_to=upload_profile_image,
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

    agent_account = models.ForeignKey(
        AgentAccount,
        related_name='agent_applications',
        on_delete=models.CASCADE
    )
    agent_name = models.CharField(max_length=100)
    license_number = models.CharField(max_length=100)
    license_document_path = models.ImageField(
        upload_to=upload_license_document,
        validators=[validate_image_file_extension],
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=100,
        choices=AGENT_APP_STATUS.CHOICES,
        default=AGENT_APP_STATUS.PENDING
    )
    application_date = models.DateTimeField(auto_now_add=True)
    date_reviewed = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
