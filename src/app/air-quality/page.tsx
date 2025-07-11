"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AirQualityDashboard from "@/components/air-quality/AirQualityDashboard";
import AirQualityMap from "@/components/air-quality/AirQualityMap";
import AirQualityStats from "@/components/air-quality/AirQualityStats";
import AirQualityChart from "@/components/air-quality/AirQualityChart";
import AirQualityHistory from "@/components/air-quality/AirQualityHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  Bell,
  AlertTriangle,
  Activity,
  MapPin,
  Clock,
  TrendingUp,
  Shield,
  Settings,
  Share2,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  Info,
} from "lucide-react";



export default function AirQualityPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [alertsEnabled, setAlertsEnabled] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
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

            {/* Enhanced Action Panel */}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={alertsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className="flex items-center gap-2"
                >
                  <Bell className="h-4 w-4" />
                  Alerts
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Status Overview */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {currentAQI}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Current AQI
                    </div>
                  </div>
                  <Badge className={`${currentColor} text-white`}>
                    {currentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      5
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Active Stations
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      28°C
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Temperature
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      2
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Active Alerts
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Range Selector */}
          <div
            className="flex flex-wrap items-center gap-2 mb-6"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">
              Time Range:
            </span>
            {["1h", "6h", "24h", "7d", "30d"].map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
                className="h-8 px-3 text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
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
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
                <AirQualityStats />
              </Card>
            </div>
          </div>

          {/* Interactive Map Section */}
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
            <div className="lg:col-span-2 xl:col-span-3">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    Analytics & Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <AirQualityChart />
                </CardContent>
              </Card>
            </div>

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

          {/* Information & Actions Section */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            {/* Health Recommendations */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Shield className="h-5 w-5" />
                  Health Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-blue-800 dark:text-blue-200">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-blue-500" />
                    <span>
                      Limit outdoor activities during high pollution periods
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-blue-500" />
                    <span>Use air purifiers indoors when AQI exceeds 100</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-blue-500" />
                    <span>Wear N95 masks when going outside</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-blue-500" />
                    <span>Stay hydrated and avoid heavy exercise outdoors</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Bell className="h-4 w-4 mr-2" />
                    Set Air Quality Alerts
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-700 hover:bg-green-50"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-700 hover:bg-green-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-700 hover:bg-green-50"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                  <Info className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-800 dark:text-purple-200">
                      Data Sources
                    </span>
                    <Badge
                      variant="outline"
                      className="text-green-700 border-green-600"
                    >
                      5 Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-800 dark:text-purple-200">
                      Last Sync
                    </span>
                    <span className="text-sm text-purple-600 dark:text-purple-300">
                      2 min ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-800 dark:text-purple-200">
                      System Health
                    </span>
                    <Badge
                      variant="outline"
                      className="text-green-700 border-green-600"
                    >
                      Optimal
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-800 dark:text-purple-200">
                      Data Quality
                    </span>
                    <span className="text-sm text-purple-600 dark:text-purple-300">
                      98.5%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
