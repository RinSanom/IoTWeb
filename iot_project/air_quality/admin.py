from django.contrib import admin
from .models import AirQualityReading

@admin.register(AirQualityReading)
class AirQualityReadingAdmin(admin.ModelAdmin):
    list_display = ['aqi_category', 'pm2_5', 'pm10', 'no2', 'o3', 'timestamp']
    list_filter = ['aqi_category', 'timestamp']
    ordering = ['-timestamp']
    readonly_fields = ['timestamp']
