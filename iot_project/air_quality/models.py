from django.db import models

class AirQualityReading(models.Model):
    aqi_category = models.CharField(max_length=100)
    pm10 = models.FloatField()
    pm2_5 = models.FloatField()
    no2 = models.FloatField()
    o3 = models.FloatField()
    co = models.FloatField()
    so2 = models.FloatField()
    nh3 = models.FloatField()
    pb = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AQI: {self.aqi_category} at {self.timestamp}"

    class Meta:
        verbose_name = "Air Quality Data"
        verbose_name_plural = "Air Quality Data"
