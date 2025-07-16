from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AirQualityReading

@api_view(['GET'])
@csrf_exempt
def air_quality_readings(request):
    data = AirQualityReading.objects.all().order_by('-timestamp')
    result = [
        {
            "id": reading.id,
            "aqi_category": reading.aqi_category,
            "pm10": reading.pm10,
            "pm2_5": reading.pm2_5,
            "no2": reading.no2, 
            "o3": reading.o3,
            "co": reading.co,
            "so2": reading.so2,
            "nh3": reading.nh3,
            "pb": reading.pb,
            "timestamp": reading.timestamp.isoformat()
        }
        for reading in data
    ]
    return Response(result)

@api_view(['GET'])
@csrf_exempt
def latest_reading(request):
    try:
        reading = AirQualityReading.objects.latest('timestamp')
        data = {
            "id": reading.id,
            "aqi_category": reading.aqi_category,
            "pm10": reading.pm10,
            "pm2_5": reading.pm2_5,
            "no2": reading.no2,
            "o3": reading.o3,
            "co": reading.co,
            "so2": reading.so2,
            "nh3": reading.nh3,
            "pb": reading.pb,
            "timestamp": reading.timestamp.isoformat()
        }
        return Response(data)
    except AirQualityReading.DoesNotExist:
        return Response({'error': 'No readings found'}, status=404)

