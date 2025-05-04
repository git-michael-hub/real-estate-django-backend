from django.contrib import admin
from .models import Property


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list = [field.name for field in Property._meta.get_fields()]

    list_display = ['id']
