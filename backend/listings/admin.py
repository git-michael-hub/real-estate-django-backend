from django.contrib import admin
from .models import Listing

from django.shortcuts import redirect
from django.urls import reverse, path
from django.utils.html import format_html
# Register your models here.


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list = [field.name for field in Listing._meta.get_fields()]

    list_display = ['id', 'title', 'seller']
