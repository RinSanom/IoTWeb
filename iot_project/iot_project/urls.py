
from django.contrib import admin
from django.urls import path , include
from air_quality.views import air_quality_readings, latest_reading
from auth_api.views import ProfileView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('air-quality/', air_quality_readings, name='air_quality_readings'),
    path('air-quality/latest/', latest_reading, name='latest_reading'),
    # Include the auth_api URLs
    path('auth/', include('auth_api.urls')),  
    path('profile/', ProfileView.as_view(), name='profile'),
]
