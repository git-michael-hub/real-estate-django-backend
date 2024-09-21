from django.contrib import admin
from .models import Listing
# Register your models here.


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list = [field.name for field in Listing._meta.get_fields()]
