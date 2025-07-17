"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AirQualityDashboard from "@/components/air-quality/AirQualityDashboard";
import AirQualityMap from "@/components/air-quality/AirQualityMap";
import AirQualityHistory from "@/components/air-quality/AirQualityHistory";
import AirQualityRealTime from "@/components/air-quality/AirQualityRealTime";
import { useGetWeatherQuery } from "@/lib/services/weatherApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RefreshCw,
  MapPin,
  Clock,
  Filter,
  Search,
} from "lucide-react";

export default function AirQualityPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Phnom Penh coordinates
  const { data: weatherData, error: weatherError, isLoading: weatherLoading } = useGetWeatherQuery({
    latitude: 11.5564,
    longitude: 104.9282,
  });

  // Get current temperature (first value in the hourly array)
  const currentTemperature = weatherData?.hourly?.temperature_2m?.[0];
  const formattedTemperature = currentTemperature ? `${Math.round(currentTemperature)}°C` : '28°C';

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 50,
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    if (aqi <= 300) return "bg-purple-500";
    return "bg-red-800";
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const currentAQI = 85;
  const currentStatus = getAQIStatus(currentAQI);
  const currentColor = getAQIColor(currentAQI);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-32 sm:pt-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.1),transparent_50%)] pointer-events-none"></div>

      <div className="relative container mx-auto px-4 py-8 max-w-8xl md:px-6 lg:px-[120px]">
        <div className="mb-12" data-aos="fade-up">
          <div className="flex flex-col lg:flex-row items-start justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                {/* <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div> */}
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                    Air Quality Monitor
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="text-lg text-slate-600 dark:text-slate-300">
                      Phnom Penh, Cambodia
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alertsEnabled ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span>Alerts {alertsEnabled ? "Active" : "Disabled"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                
              </div>
            </div>
          </div>  
        </div>

        {/* Real-time Air Quality Data from MQTT */}
        <div className="mb-8" data-aos="fade-up" data-aos-delay="250">
          <AirQualityRealTime />
        </div>

        {/* Enhanced Dashboard Grid */}
        <div className="space-y-6 sm:space-y-8">
          <div
            className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="lg:col-span-2 xl:col-span-3">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
                <AirQualityDashboard />
              </Card>
            </div>
            <div className="lg:col-span-1 xl:col-span-2">
               <div className="lg:col-span-1 xl:col-span-2">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <AirQualityHistory />
                </CardContent>
              </Card>
            </div>
            </div>
          </div>
          <div className="w-full" data-aos="fade-up" data-aos-delay="300">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Air Quality Map
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-1" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <AirQualityMap />
              </CardContent>
            </Card>
          </div>
          {/* Analytics Section */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
            data-aos="fade-up"
            data-aos-delay="400"
          >
          </div>
        </div>
      </div>
    </div>
  );
}
