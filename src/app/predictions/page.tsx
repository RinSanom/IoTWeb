"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  BarChart3,
  Calendar,
  Clock,
  MapPin,
  Gauge,
  Wind,
  Thermometer,
  Droplets,
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
import {
  getAQIStatus,
  getAQIColorClass,
  getAQIHexColor,
} from "@/lib/healthAdvice";

interface PredictionData {
  predicted_aqi: number;
  status: string;
  confidence: number;
  health_advice: string;
}

interface ForecastItem {
  datetime: string;
  aqi: number;
  status: string;
  health_advice: string;
}

interface ForecastData {
  forecast: ForecastItem[];
  fallback?: boolean;
  message?: string;
}

interface ParameterInfo {
  unit: string;
  description: string;
}

interface ApiMetadata {
  api: string;
  description: string;
  model_accuracy: string;
  status: string;
  version: string;
  timestamp: string;
}

export default function PredictionsPage() {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<ForecastData | null>(
    null
  );
  const [dailyForecast, setDailyForecast] = useState<ForecastData | null>(null);
  const [parameters, setParameters] = useState<Record<
    string,
    ParameterInfo
  > | null>(null);
  const [metadata, setMetadata] = useState<ApiMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("predict");

  // Form data for prediction
  const [predictionParams, setPredictionParams] = useState({
    temperature: "",
    humidity: "",
    pm25: "",
    pm10: "",
    o3: "",
    no2: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 50,
    });

    // Load initial data
    fetchParameters();
    fetchMetadata();
    fetchForecasts();
  }, []);

  const fetchParameters = async () => {
    try {
      const response = await fetch("/api/ml-predictions/parameters");
      const data = await response.json();
      setParameters(data.parameters || data);
    } catch (error) {
      console.error("Error fetching parameters:", error);
    }
  };

  const fetchMetadata = async () => {
    try {
      const response = await fetch("/api/ml-predictions/data/metadata");
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const fetchForecasts = async () => {
    setForecastLoading(true);
    try {
      const [hourlyRes, dailyRes] = await Promise.all([
        fetch("/api/ml-predictions/forecast/hourly"),
        fetch("/api/ml-predictions/forecast/daily"),
      ]);

      const hourlyData = await hourlyRes.json();
      const dailyData = await dailyRes.json();

      setHourlyForecast(hourlyData);
      setDailyForecast(dailyData);
    } catch (error) {
      console.error("Error fetching forecasts:", error);
    } finally {
      setForecastLoading(false);
    }
  };

  const makePrediction = async () => {
    if (!predictionParams.temperature || !predictionParams.humidity) {
      alert("Please fill in at least temperature and humidity values");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ml-predictions/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temperature: parseFloat(predictionParams.temperature),
          humidity: parseFloat(predictionParams.humidity),
          pm25: predictionParams.pm25
            ? parseFloat(predictionParams.pm25)
            : undefined,
          pm10: predictionParams.pm10
            ? parseFloat(predictionParams.pm10)
            : undefined,
          o3: predictionParams.o3 ? parseFloat(predictionParams.o3) : undefined,
          no2: predictionParams.no2
            ? parseFloat(predictionParams.no2)
            : undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPrediction(data);
      } else {
        console.error("Prediction error:", data);
      }
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (aqi: number) => {
    if (aqi <= 50) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (aqi <= 100) return <Activity className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-32 sm:pt-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/20">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                AI Predictions Center
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-lg text-slate-600 dark:text-slate-300">
                  Machine Learning Air Quality Predictions
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            {metadata && (
              <>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  <span>Model Accuracy: {metadata.model_accuracy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      metadata.status === "operational"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span>Status: {metadata.status}</span>
                </div>
                <div className="text-xs">v{metadata.version}</div>
              </>
            )}
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger
              value="predict"
              className="flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>Predict AQI</span>
            </TabsTrigger>
            <TabsTrigger value="hourly" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Hourly Forecast</span>
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Daily Forecast</span>
            </TabsTrigger>
          </TabsList>

          {/* Prediction Tab */}
          <TabsContent value="predict" data-aos="fade-up" data-aos-delay="200">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  AQI Prediction Tool
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enter environmental parameters to predict air quality using
                  our 99.95% accurate ML model
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="temperature"
                      className="flex items-center gap-2"
                    >
                      <Thermometer className="h-4 w-4 text-red-500" />
                      Temperature (°C) *
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      placeholder="e.g., 28"
                      value={predictionParams.temperature}
                      onChange={(e) =>
                        setPredictionParams((prev) => ({
                          ...prev,
                          temperature: e.target.value,
                        }))
                      }
                    />
                    {parameters?.temperature && (
                      <p className="text-xs text-slate-500">
                        {parameters.temperature.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="humidity"
                      className="flex items-center gap-2"
                    >
                      <Droplets className="h-4 w-4 text-blue-500" />
                      Humidity (%) *
                    </Label>
                    <Input
                      id="humidity"
                      type="number"
                      placeholder="e.g., 65"
                      value={predictionParams.humidity}
                      onChange={(e) =>
                        setPredictionParams((prev) => ({
                          ...prev,
                          humidity: e.target.value,
                        }))
                      }
                    />
                    {parameters?.humidity && (
                      <p className="text-xs text-slate-500">
                        {parameters.humidity.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pm25" className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-orange-500" />
                      PM2.5 (μg/m³)
                    </Label>
                    <Input
                      id="pm25"
                      type="number"
                      placeholder="e.g., 35"
                      value={predictionParams.pm25}
                      onChange={(e) =>
                        setPredictionParams((prev) => ({
                          ...prev,
                          pm25: e.target.value,
                        }))
                      }
                    />
                    {parameters?.pm25 && (
                      <p className="text-xs text-slate-500">
                        {parameters.pm25.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pm10">PM10 (μg/m³)</Label>
                    <Input
                      id="pm10"
                      type="number"
                      placeholder="e.g., 50"
                      value={predictionParams.pm10}
                      onChange={(e) =>
                        setPredictionParams((prev) => ({
                          ...prev,
                          pm10: e.target.value,
                        }))
                      }
                    />
                    {parameters?.pm10 && (
                      <p className="text-xs text-slate-500">
                        {parameters.pm10.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="o3">O3 (μg/m³)</Label>
                    <Input
                      id="o3"
                      type="number"
                      placeholder="e.g., 120"
                      value={predictionParams.o3}
                      onChange={(e) =>
                        setPredictionParams((prev) => ({
                          ...prev,
                          o3: e.target.value,
                        }))
                      }
                    />
                    {parameters?.o3 && (
                      <p className="text-xs text-slate-500">
                        {parameters.o3.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="no2">NO2 (μg/m³)</Label>
                    <Input
                      id="no2"
                      type="number"
                      placeholder="e.g., 40"
                      value={predictionParams.no2}
                      onChange={(e) =>
                        setPredictionParams((prev) => ({
                          ...prev,
                          no2: e.target.value,
                        }))
                      }
                    />
                    {parameters?.no2 && (
                      <p className="text-xs text-slate-500">
                        {parameters.no2.description}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={makePrediction}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Predict AQI
                    </>
                  )}
                </Button>

                {prediction && (
                  <div className="mt-6 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(prediction.predicted_aqi)}
                        <div>
                          <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                            {prediction.predicted_aqi}
                          </div>
                          <div className="text-sm text-purple-600 dark:text-purple-300">
                            Predicted AQI
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={getAQIColorClass(prediction.predicted_aqi)}
                        >
                          {prediction.status}
                        </Badge>
                        <div className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                          Confidence: {Math.round(prediction.confidence * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-purple-800 dark:text-purple-200">
                      <strong>Health Advice:</strong> {prediction.health_advice}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hourly Forecast Tab */}
          <TabsContent value="hourly" data-aos="fade-up" data-aos-delay="300">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <CardTitle>24-Hour AQI Forecast</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchForecasts}
                  disabled={forecastLoading}
                >
                  {forecastLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {forecastLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : hourlyForecast &&
                  hourlyForecast.forecast &&
                  hourlyForecast.forecast.length > 0 ? (
                  <div className="space-y-6">
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
                                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                                    <p className="font-medium">{label}</p>
                                    <p className="text-sm text-gray-600">
                                      {data.date}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <div className="text-lg font-bold">
                                        AQI: {data.aqi}
                                      </div>
                                      <Badge
                                        className={getAQIColorClass(data.aqi)}
                                      >
                                        {data.status}
                                      </Badge>
                                    </div>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {hourlyForecast.forecast
                        .slice(0, 8)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded-lg bg-white dark:bg-slate-800"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">
                                {new Date(item.datetime).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </div>
                              <Badge className={getAQIColorClass(item.aqi)}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold mb-1">
                              {item.aqi}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {item.health_advice}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No hourly forecast data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Forecast Tab */}
          <TabsContent value="daily" data-aos="fade-up" data-aos-delay="400">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-green-600" />
                  <CardTitle>7-Day AQI Forecast</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchForecasts}
                  disabled={forecastLoading}
                >
                  {forecastLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {forecastLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : dailyForecast &&
                  dailyForecast.forecast &&
                  dailyForecast.forecast.length > 0 ? (
                  <div className="space-y-6">
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
                                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                                    <p className="font-medium">{label}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <div className="text-lg font-bold">
                                        AQI: {data.aqi}
                                      </div>
                                      <Badge
                                        className={getAQIColorClass(data.aqi)}
                                      >
                                        {data.status}
                                      </Badge>
                                    </div>
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
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dailyForecast.forecast.slice(0, 6).map((item, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-white dark:bg-slate-800"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">
                              {new Date(item.datetime).toLocaleDateString([], {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <Badge className={getAQIColorClass(item.aqi)}>
                              {item.status}
                            </Badge>
                          </div>
                          <div className="text-3xl font-bold mb-2">
                            {item.aqi}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.health_advice}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No daily forecast data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
