from django.contrib import admin
from django.contrib.auth.models import User

from favorites.models import Favorites

from .models import EmailVerificationRequest, PasswordResetRequest, SellerProfile


admin.site.unregister(User)


class FavoritesInline(admin.TabularInline):
    model = Favorites


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']
    list = [field.name for field in User._meta.get_fields()]

    inlines = [
        FavoritesInline
    ]


@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ['user']
    list = [field.name for field in SellerProfile._meta.get_fields()]


@admin.register(PasswordResetRequest)
class PasswordResetRequestAdmin(admin.ModelAdmin):
    fields = ('email', 'token', 'created_at')


@admin.register(EmailVerificationRequest)
class EmailVerificationRequestAdmin(admin.ModelAdmin):
    fields = ('email', 'pin')
