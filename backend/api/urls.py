from django.urls import path, include

urlpatterns = [
    path('auth/', include('users.urls')),
    path('sellers/', include('sellers.urls')),
    path('buyers/', include('buyers.urls')),
    path('agents/', include('agents.urls')),
    path('properties/', include('properties.urls')),
    path('listings/', include('listings.urls')),
    path('inquiries/', include('inquiries.urls')),
]
