from django.contrib import admin
from django.contrib.auth.models import User

from .models import EmailVerificationRequest, PasswordResetRequest, Roles
from favorites.models import Favorites


admin.site.unregister(User)


class RolesInline(admin.StackedInline):
    model = Roles


class FavoritesInline(admin.TabularInline):
    model = Favorites


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']
    list = [field.name for field in User._meta.get_fields()]

    inlines = [
        RolesInline,
        FavoritesInline
    ]


@admin.register(PasswordResetRequest)
class PasswordResetRequestAdmin(admin.ModelAdmin):
    fields = ('email', 'token', 'created_at')


@admin.register(EmailVerificationRequest)
class EmailVerificationRequestAdmin(admin.ModelAdmin):
    fields = ('email', 'pin')
