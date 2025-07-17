"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetWeatherQuery } from "@/lib/services/weatherApi";
import {
  Activity,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Gauge,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";

// Static air quality data (weather will be fetched from API)
const airQualityData = {
  aqi: 85,
  status: "Moderate",
  location: "Phnom Penh, Cambodia",
  coordinates: "11.5564°N, 104.9282°E",
  lastUpdated: "2 minutes ago",
  trend: "decreasing",
  pollutants: {
    pm25: { value: 35, unit: "μg/m³", status: "Good", color: "text-green-600" },
    pm10: {
      value: 50,
      unit: "μg/m³",
      status: "Moderate",
      color: "text-yellow-600",
    },
    o3: {
      value: 120,
      unit: "μg/m³",
      status: "Moderate",
      color: "text-yellow-600",
    },
    no2: { value: 40, unit: "μg/m³", status: "Good", color: "text-green-600" },
    so2: { value: 15, unit: "μg/m³", status: "Good", color: "text-green-600" },
    co: { value: 1.2, unit: "mg/m³", status: "Good", color: "text-green-600" },
  },
  healthRecommendation:
    "Moderate air quality. Sensitive individuals should limit prolonged outdoor exertion.",
  dominantPollutant: "PM2.5",
};

// Phnom Penh coordinates for weather API
const PHNOM_PENH_COORDS = {
  latitude: 11.5564,
  longitude: 104.9282,
};

const getAQIBgColor = (aqi: number) => {
  if (aqi <= 50) return "bg-green-500";
  if (aqi <= 100) return "bg-yellow-500";
  if (aqi <= 150) return "bg-orange-500";
  if (aqi <= 200) return "bg-red-500";
  if (aqi <= 300) return "bg-purple-500";
  return "bg-red-800";
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "good":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "moderate":
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    default:
      return <XCircle className="h-5 w-5 text-red-600" />;
  }
};

export default function AirQualityDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRealTime] = useState(true);

  // Fetch live weather data
  const {
    data: weatherData,
    error: weatherError,
    isLoading: weatherLoading,
  } = useGetWeatherQuery(PHNOM_PENH_COORDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const aqiBgColor = getAQIBgColor(airQualityData.aqi);

  // Helper function to get wind direction from degrees
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  // Get current weather data from API response
  const getCurrentWeather = () => {
    if (!weatherData || !weatherData.hourly) return null;
    
    const now = new Date();
    const currentHourIndex = now.getHours();
    
    return {
      temperature: Math.round(weatherData.hourly.temperature_2m[currentHourIndex] || 0),
      humidity: Math.round(weatherData.hourly.relative_humidity_2m[currentHourIndex] || 0),
      windSpeed: Math.round(weatherData.hourly.wind_speed_10m[currentHourIndex] || 0),
      windDirection: getWindDirection(weatherData.hourly.wind_direction_10m[currentHourIndex] || 0),
      pressure: Math.round(weatherData.hourly.surface_pressure[currentHourIndex] || 0),
      visibility: Math.round((weatherData.hourly.visibility[currentHourIndex] || 0) / 1000), // Convert meters to km
    };
  };

  const currentWeather = getCurrentWeather();

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Current Weather 
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {airQualityData.location}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({airQualityData.coordinates})
            </span>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isRealTime ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {isRealTime ? "Live" : "Offline"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>
  
      {/* Weather Info - Live Data */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
            Weather
            {weatherLoading && (
              <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weatherError ? (
            <div className="text-red-600 dark:text-red-400 text-center py-4">
              <p>Failed to load weather data</p>
              <p className="text-sm mt-1">Please check your connection and try again</p>
            </div>
          ) : weatherLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 animate-pulse">
                    <div className="h-5 w-5 bg-blue-200 dark:bg-blue-800 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded animate-pulse w-16"></div>
                    <div className="h-5 bg-blue-200 dark:bg-blue-800 rounded animate-pulse w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Temperature
                  </p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    {currentWeather ? `${currentWeather.temperature}°C` : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Droplets className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Humidity
                  </p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    {currentWeather ? `${currentWeather.humidity}%` : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Wind className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Wind
                  </p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    {currentWeather ? `${currentWeather.windSpeed} km/h ${currentWeather.windDirection}` : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Visibility
                  </p>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    {currentWeather ? `${currentWeather.visibility} km` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <Button className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          View Details
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Gauge className="h-4 w-4" />
          Historical Data
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Forecast
        </Button>
      </div>
    </div>
  );
}
