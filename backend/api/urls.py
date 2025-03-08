from django.urls import path, include

urlpatterns = [
    path('users/', include('users.urls')),
    path('sellers/', include('sellers.urls')),
    path('buyers/', include('buyers.urls')),
    path('properties/', include('properties.urls')),
    path('listings/', include('listings.urls')),
    path('inquiries/', include('inquiries.urls')),
]
