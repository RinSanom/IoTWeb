"use client";

import {
  useGetLatestAirQualityQuery,
  useGetAirQualityDataQuery,
} from "@/lib/services/airQualityApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Thermometer,
  Wind,
  Droplets,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const getAQICategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "good":
      return "bg-green-500 text-white";
    case "moderate":
    case "fair":
      return "bg-yellow-500 text-white";
    case "unhealthy for sensitive groups":
      return "bg-orange-500 text-white";
    case "unhealthy":
      return "bg-red-500 text-white";
    case "very unhealthy":
      return "bg-purple-500 text-white";
    case "hazardous":
      return "bg-maroon-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getAQILevel = (category: string) => {
  switch (category.toLowerCase()) {
    case "good":
      return {
        level: "Good",
        description: "Air quality is satisfactory for most people",
      };
    case "moderate":
    case "fair":
      return {
        level: "Moderate",
        description: "Air quality is acceptable for most people",
      };
    case "unhealthy for sensitive groups":
      return { level: "USG", description: "Unhealthy for sensitive groups" };
    case "unhealthy":
      return {
        level: "Unhealthy",
        description: "Health effects may be experienced by everyone",
      };
    case "very unhealthy":
      return {
        level: "Very Unhealthy",
        description: "Health alert: everyone may experience serious effects",
      };
    case "hazardous":
      return {
        level: "Hazardous",
        description: "Emergency conditions: everyone affected",
      };
    default:
      return {
        level: "Unknown",
        description: "Unable to determine air quality",
      };
  }
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateTrend = (current: number, previous: number) => {
  if (!previous) return { trend: "neutral", change: 0 };
  const change = current - previous;
  const trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";
  return { trend, change: Math.abs(change) };
};

export default function AirQualityRealTime() {
  const [viewMode, setViewMode] = useState<"current" | "history" | "charts">(
    "current"
  );
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const {
    data: latestData,
    error: latestError,
    isLoading: latestLoading,
    refetch: refetchLatest,
  } = useGetLatestAirQualityQuery(undefined, {
    pollingInterval: 5000, // Refetch every 5 seconds for more dynamic updates
  });

  const {
    data: allData,
    error: allError,
    isLoading: allLoading,
    refetch: refetchAll,
  } = useGetAirQualityDataQuery(undefined, {
    pollingInterval: 30000, // Refetch historical data every 30 seconds
  });

  useEffect(() => {
    refetchLatest();
    refetchAll();
    setLastRefresh(new Date());
  }, [refetchLatest, refetchAll]);

  const handleRefresh = () => {
    refetchLatest();
    refetchAll();
    setLastRefresh(new Date());
  };

  // Prepare chart data
  const chartData =
    allData
      ?.slice(0, 24)
      .reverse()
      .map((reading) => ({
        time: formatTime(reading.timestamp),
        pm25: reading.pm2_5,
        pm10: reading.pm10,
        no2: reading.no2,
        o3: reading.o3,
        co: reading.co,
        so2: reading.so2,
        timestamp: reading.timestamp,
      })) || [];

  if (latestLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading air quality data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (latestError || allError) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load air quality data</p>
            <p className="text-sm text-gray-600">
              Make sure your IoT sensor API is running:{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">
                https://kit-classic-ladybird.ngrok-free.app/api/latest
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestData) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-gray-600">No air quality data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header with Navigation */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Air Quality Monitor
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={latestLoading || allLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    latestLoading || allLoading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "current" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("current")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Current
            </Button>
            <Button
              variant={viewMode === "history" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("history")}
            >
              <Clock className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button
              variant={viewMode === "charts" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("charts")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Charts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current View */}
      {viewMode === "current" && (
        <>
          {/* Current Air Quality Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  Current Air Quality
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Badge
                    className={getAQICategoryColor(
                      latestData?.aqi_category || ""
                    )}
                  >
                    {getAQILevel(latestData?.aqi_category || "").level}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getAQILevel(latestData?.aqi_category || "").description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last reading:{" "}
                  {latestData
                    ? formatTimestamp(latestData.timestamp)
                    : "No data"}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* PM2.5 */}
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Wind className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      PM2.5
                    </p>
                    <p className="text-2xl font-bold">
                      {latestData?.pm2_5 || "--"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      μg/m³
                    </p>
                  </div>
                </div>

                {/* PM10 */}
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Wind className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      PM10
                    </p>
                    <p className="text-2xl font-bold">
                      {latestData?.pm10 || "--"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      μg/m³
                    </p>
                  </div>
                </div>

                {/* NO2 */}
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      NO₂
                    </p>
                    <p className="text-2xl font-bold">
                      {latestData?.no2 || "--"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      μg/m³
                    </p>
                  </div>
                </div>

                {/* O3 */}
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Droplets className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      O₃
                    </p>
                    <p className="text-2xl font-bold">
                      {latestData?.o3 || "--"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      μg/m³
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional pollutants */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    CO
                  </p>
                  <p className="text-xl font-bold">{latestData?.co || "--"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    mg/m³
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    SO₂
                  </p>
                  <p className="text-xl font-bold">{latestData?.so2 || "--"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    μg/m³
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    NH₃
                  </p>
                  <p className="text-xl font-bold">{latestData?.nh3 || "--"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    μg/m³
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Pb
                  </p>
                  <p className="text-xl font-bold">{latestData?.pb || "--"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    μg/m³
                  </p>
                </div>
              </div>

              {/* PM Sensor Detailed Data */}
              {(latestData as any)?.particles_0_3um !== undefined && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Particle Count (per 0.1L air)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        ≥0.3μm
                      </p>
                      <p className="text-lg font-bold">
                        {(latestData as any)?.particles_0_3um || "--"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">
                        ≥0.5μm
                      </p>
                      <p className="text-lg font-bold">
                        {(latestData as any)?.particles_0_5um || "--"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                        ≥1.0μm
                      </p>
                      <p className="text-lg font-bold">
                        {(latestData as any)?.particles_1_0um || "--"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                        ≥2.5μm
                      </p>
                      <p className="text-lg font-bold">
                        {(latestData as any)?.particles_2_5um || "--"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-xs font-medium text-red-600 dark:text-red-400">
                        ≥5.0μm
                      </p>
                      <p className="text-lg font-bold">
                        {(latestData as any)?.particles_5_0um || "--"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                        ≥10μm
                      </p>
                      <p className="text-lg font-bold">
                        {(latestData as any)?.particles_10um || "--"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sensor Status */}
              {(latestData as any)?.sensor_status && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    Sensor Status
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Status</p>
                      <p className="font-medium capitalize">
                        {(latestData as any)?.sensor_status || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Quality Level
                      </p>
                      <p className="font-medium">
                        {(latestData as any)?.quality_level || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Quality
                      </p>
                      <p className="font-medium">
                        {(latestData as any)?.quality_description || "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        PM2.5 Uncertainty
                      </p>
                      <p className="font-medium">
                        {(latestData as any)?.pm2_5_uncertainty
                          ? `±${(latestData as any).pm2_5_uncertainty}%`
                          : "--"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* History View */}
      {viewMode === "history" && allData && allData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Air Quality History
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recent readings from your sensors
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-3 font-medium">Time</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">PM2.5</th>
                    <th className="text-left p-3 font-medium">PM10</th>
                    <th className="text-left p-3 font-medium">NO₂</th>
                    <th className="text-left p-3 font-medium">O₃</th>
                    <th className="text-left p-3 font-medium">CO</th>
                    <th className="text-left p-3 font-medium">SO₂</th>
                  </tr>
                </thead>
                <tbody>
                  {allData.slice(0, 20).map((reading, index) => {
                    const prevReading = allData[index + 1];
                    const pm25Trend = prevReading
                      ? calculateTrend(reading.pm2_5, prevReading.pm2_5)
                      : { trend: "neutral", change: 0 };

                    return (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="p-3">
                          {formatTimestamp(reading.timestamp)}
                        </td>
                        <td className="p-3">
                          <Badge
                            className={getAQICategoryColor(
                              reading.aqi_category
                            )}
                            variant="outline"
                          >
                            {getAQILevel(reading.aqi_category).level}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span>{reading.pm2_5}</span>
                            {pm25Trend.trend !== "neutral" &&
                              (pm25Trend.trend === "up" ? (
                                <TrendingUp className="h-3 w-3 text-red-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-green-500" />
                              ))}
                          </div>
                        </td>
                        <td className="p-3">{reading.pm10}</td>
                        <td className="p-3">{reading.no2}</td>
                        <td className="p-3">{reading.o3}</td>
                        <td className="p-3">{reading.co}</td>
                        <td className="p-3">{reading.so2}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts View */}
      {viewMode === "charts" && chartData.length > 0 && (
        <div className="space-y-6">
          {/* PM2.5 and PM10 Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Particulate Matter (PM2.5 & PM10)</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last 24 hours trend
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => `Time: ${value}`}
                      formatter={(value, name) => [
                        `${value} μg/m³`,
                        name === "pm25" ? "PM2.5" : "PM10",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="pm25"
                    />
                    <Line
                      type="monotone"
                      dataKey="pm10"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="pm10"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gases Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Gas Pollutants (NO₂ & O₃)</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last 24 hours trend
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => `Time: ${value}`}
                      formatter={(value, name) => [
                        `${value} μg/m³`,
                        name === "no2" ? "NO₂" : "O₃",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="no2"
                      stackId="1"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.6}
                      name="no2"
                    />
                    <Area
                      type="monotone"
                      dataKey="o3"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                      name="o3"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Additional Pollutants Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Other Pollutants (CO & SO₂)</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last 24 hours trend
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => `Time: ${value}`}
                      formatter={(value, name) => [
                        name === "co" ? `${value} mg/m³` : `${value} μg/m³`,
                        name === "co" ? "CO" : "SO₂",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="co"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="co"
                    />
                    <Line
                      type="monotone"
                      dataKey="so2"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="so2"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Data States */}
      {!allData || allData.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                No air quality data available
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Make sure your sensor is connected and sending data
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
