from django.urls import path, include

urlpatterns = [
    path('users/', include('users.urls')),
    path('listings/', include('listings.urls')),
    path('inquiries/', include('inquiries.urls')),
    path('buyers/', include('buyers.urls')),
    path('sellers/', include('sellers.urls')),
    path('inquiries/', include('inquiries.urls'))
]
