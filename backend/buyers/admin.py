from django.contrib import admin

# Register your models here.
from .models import BuyerAccount, BuyerEmailValidationRequest

admin.site.register(BuyerAccount)
admin.site.register(BuyerEmailValidationRequest)
