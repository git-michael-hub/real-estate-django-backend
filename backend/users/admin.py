from django.contrib import admin

from .models import PasswordResetRequest, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']
    list = [field.name for field in User._meta.get_fields()]


@admin.register(PasswordResetRequest)
class PasswordResetRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at')
    fields = ('user', 'token', 'created_at')
    readonly_fields = ('user', 'token', 'created_at')
