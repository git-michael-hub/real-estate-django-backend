from django.contrib import admin
from .models import PasswordResetRequest, EmailVerificationRequest


@admin.register(PasswordResetRequest)
class PasswordResetRequestAdmin(admin.ModelAdmin):
    fields = ('email', 'token', 'created_at')


@admin.register(EmailVerificationRequest)
class EmailVerificationRequestAdmin(admin.ModelAdmin):
    fields = ('email', 'pin')
