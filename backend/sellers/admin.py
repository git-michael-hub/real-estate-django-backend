from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import HttpResponseForbidden
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from .models import SellerEmailValidationRequest, SellerApplication, SellerAccount


admin.site.register(SellerEmailValidationRequest)
admin.site.register(SellerAccount)


@admin.register(SellerApplication)
class SellerApplicationAdmin(admin.ModelAdmin):
    list_display = ['email', 'status']
    change_form_template = 'admin/sellers/change_form.html'

    csrf_protect_m = method_decorator(csrf_protect)

    @csrf_protect_m
    def change_view(self, request, object_id, form_url="", extra_context=None):
        if request.user.is_staff == True:

            to = '/' + '/'.join(request.build_absolute_uri().split('/')[3:])

            if "_approve_application" in request.POST:
                seller_application = SellerApplication.objects.get(
                    email=request.POST['email'], status='P')

                user = User(email=seller_application.email,
                            username=seller_application.username,
                            password=seller_application.password
                            )

                seller_account = SellerAccount(
                    user=user, sellerapplication_ptr=seller_application, birthdate=seller_application.birthdate,
                    application_date=seller_application.application_date,
                    contact_number_1=seller_application.contact_number_1

                )

                seller_application.status = 'A'

                user.save()
                seller_account.save()
                seller_application.save()

                messages.success(request, 'Application Approved.')
                return redirect(to)

            if "_reject_application" in request.POST:
                seller_application = SellerApplication.objects.get(
                    email=request.POST['email'], status='P')

                seller_application.status = 'R'
                seller_application.save()

                messages.warning(request, 'Application Rejected.')
                return redirect(to)

            return super().change_view(request, object_id, form_url, extra_context)

        return HttpResponseForbidden("Unauthorized")
