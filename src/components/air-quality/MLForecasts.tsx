"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  TrendingUp,
  Loader2,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ForecastItem {
  datetime: string;
  aqi: number;
  status: string;
  health_advice: string;
  parameters?: {
    humidity: number;
    pm1: number;
    pm25: number;
    temperature: number;
    ultrafine_particles: number;
  };
  temporal_info?: {
    day_of_week: number;
    hour: number;
    is_weekend: boolean;
    month: number;
  };
}

interface ForecastData {
  forecast: ForecastItem[];
  fallback?: boolean;
  message?: string;
}

export default function MLForecasts() {
  const [hourlyForecast, setHourlyForecast] = useState<ForecastData | null>(
    null
  );
  const [dailyForecast, setDailyForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("hourly");

  // Fetch hourly forecast
  const fetchHourlyForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/forecast/hourly");
      const data = await response.json();
      setHourlyForecast(data);
    } catch (error) {
      console.error("Error fetching hourly forecast:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch daily forecast
  const fetchDailyForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/forecast/daily");
      const data = await response.json();
      setDailyForecast(data);
    } catch (error) {
      console.error("Error fetching daily forecast:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load forecasts on component mount
  useEffect(() => {
    fetchHourlyForecast();
    fetchDailyForecast();
  }, []);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981"; // green
    if (aqi <= 100) return "#f59e0b"; // yellow
    if (aqi <= 150) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  const getAQIBadgeColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-600 bg-green-50";
    if (aqi <= 100) return "text-yellow-600 bg-yellow-50";
    if (aqi <= 150) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const formatChartData = (forecast: ForecastItem[]) => {
    return forecast.slice(0, 24).map((item) => ({
      time: new Date(item.datetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date(item.datetime).toLocaleDateString(),
      aqi: item.aqi,
      status: item.status,
      health_advice: item.health_advice,
    }));
  };

  const formatDailyChartData = (forecast: ForecastItem[]) => {
    return forecast.slice(0, 7).map((item) => ({
      day: new Date(item.datetime).toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      aqi: item.aqi,
      status: item.status,
      health_advice: item.health_advice,
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <CardTitle>AI Air Quality Forecasts</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (activeTab === "hourly") {
              fetchHourlyForecast();
            } else {
              fetchDailyForecast();
            }
          }}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hourly" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Hourly</span>
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Daily</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hourly" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : hourlyForecast ? (
              <div className="space-y-6">
                {hourlyForecast.fallback && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    ⚠️ {hourlyForecast.message}
                  </div>
                )}

                {hourlyForecast.forecast &&
                hourlyForecast.forecast.length > 0 ? (
                  <>
                    {/* Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={formatChartData(hourlyForecast.forecast)}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="time"
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload[0]) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white p-4 border rounded-lg shadow-lg max-w-sm">
                                    <p className="font-medium">{label}</p>
                                    <p className="text-sm text-gray-600">
                                      {data.date}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <div className="text-lg font-bold">
                                        AQI: {data.aqi}
                                      </div>
                                      <Badge
                                        className={getAQIBadgeColor(data.aqi)}
                                      >
                                        {data.status}
                                      </Badge>
                                    </div>
                                    {data.parameters && (
                                      <div className="text-xs mt-2 space-y-1 bg-gray-50 p-2 rounded">
                                        <div className="grid grid-cols-2 gap-1">
                                          <div>
                                            🌡️ {data.parameters.temperature}°C
                                          </div>
                                          <div>
                                            💧 {data.parameters.humidity}%
                                          </div>
                                          <div>
                                            🌫️ PM2.5: {data.parameters.pm25}
                                          </div>
                                          <div>
                                            🔬 PM1: {data.parameters.pm1}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <p className="text-sm mt-2">
                                      {data.health_advice}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="aqi"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Quick forecast cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {hourlyForecast.forecast
                        .slice(0, 6)
                        .map((item, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">
                                {new Date(item.datetime).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </div>
                              <Badge className={getAQIBadgeColor(item.aqi)}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold mb-1">
                              {item.aqi}
                            </div>
                            <div className="text-xs text-gray-600">
                              {item.health_advice}
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hourly forecast data available
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No data available
              </div>
            )}
          </TabsContent>

          <TabsContent value="daily" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : dailyForecast ? (
              <div className="space-y-6">
                {dailyForecast.fallback && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    ⚠️ {dailyForecast.message}
                  </div>
                )}

                {dailyForecast.forecast && dailyForecast.forecast.length > 0 ? (
                  <>
                    {/* Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={formatDailyChartData(dailyForecast.forecast)}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="day"
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload[0]) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white p-4 border rounded-lg shadow-lg max-w-sm">
                                    <p className="font-medium">{label}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <div className="text-lg font-bold">
                                        AQI: {data.aqi}
                                      </div>
                                      <Badge
                                        className={getAQIBadgeColor(data.aqi)}
                                      >
                                        {data.status}
                                      </Badge>
                                    </div>
                                    {data.parameters && (
                                      <div className="text-xs mt-2 space-y-1 bg-gray-50 p-2 rounded">
                                        <div className="grid grid-cols-2 gap-1">
                                          <div>
                                            🌡️ {data.parameters.temperature}°C
                                          </div>
                                          <div>
                                            💧 {data.parameters.humidity}%
                                          </div>
                                          <div>
                                            🌫️ PM2.5: {data.parameters.pm25}
                                          </div>
                                          <div>
                                            🔬 PM1: {data.parameters.pm1}
                                          </div>
                                        </div>
                                        {data.temporal_info && (
                                          <div className="text-xs text-gray-500 mt-1">
                                            {data.temporal_info.is_weekend
                                              ? "🏖️ Weekend"
                                              : "📅 Weekday"}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    <p className="text-sm mt-2">
                                      {data.health_advice}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar
                            dataKey="aqi"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Daily forecast cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dailyForecast.forecast.slice(0, 6).map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">
                              {new Date(item.datetime).toLocaleDateString([], {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <Badge className={getAQIBadgeColor(item.aqi)}>
                              {item.status}
                            </Badge>
                          </div>
                          <div className="text-3xl font-bold mb-2">
                            {item.aqi}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.health_advice}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No daily forecast data available
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
