from django.contrib import admin
from django.contrib.auth.models import User


from .models import PasswordResetRequest


admin.site.unregister(User)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']
    list = [field.name for field in User._meta.get_fields()]


@admin.register(PasswordResetRequest)
class PasswordResetRequestAdmin(admin.ModelAdmin):
    fields = ('email', 'token', 'created_at')
