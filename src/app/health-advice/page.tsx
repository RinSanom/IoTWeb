"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Activity,
  RefreshCw,
  MapPin,
  Info,
  Shield,
  Users,
  Home,
  Wind,
} from "lucide-react";
import {
  getHealthAdvice,
  getAQIStatus,
  getAQIColorClass,
} from "@/lib/healthAdvice";

interface HealthAdviceData {
  aqi: number;
  health_advice: string;
  fallback?: boolean;
  error?: string;
}

const commonAQILevels = [
  { aqi: 25, label: "Good", description: "Air quality is satisfactory" },
  { aqi: 75, label: "Moderate", description: "Acceptable for most people" },
  {
    aqi: 125,
    label: "Unhealthy for Sensitive",
    description: "Sensitive groups may experience minor issues",
  },
  {
    aqi: 175,
    label: "Unhealthy",
    description: "Everyone may begin to experience health effects",
  },
  {
    aqi: 225,
    label: "Very Unhealthy",
    description: "Health alert: everyone may experience serious effects",
  },
  {
    aqi: 325,
    label: "Hazardous",
    description: "Emergency conditions: entire population affected",
  },
];

export default function HealthAdvicePage() {
  const [aqi, setAqi] = useState("");
  const [healthAdvice, setHealthAdvice] = useState<HealthAdviceData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 50,
    });

    // Fetch current AQI data
    fetchCurrentData();
  }, []);

  const fetchCurrentData = async () => {
    try {
      const response = await fetch("/api/ml-predictions/current");
      const data = await response.json();
      setCurrentData(data);
    } catch (error) {
      console.error("Error fetching current data:", error);
    }
  };

  const fetchHealthAdvice = async (aqiValue?: string) => {
    const targetAqi = aqiValue || aqi;
    if (!targetAqi || isNaN(Number(targetAqi))) {
      alert("Please enter a valid AQI number");
      return;
    }

    setLoading(true);
    try {
      const advice = await getHealthAdvice(Number(targetAqi));
      setHealthAdvice(advice);
      setAqi(targetAqi);
    } catch (error) {
      console.error("Error fetching health advice:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (aqi: number) => {
    if (aqi <= 50) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (aqi <= 100) return <Activity className="h-6 w-6 text-yellow-600" />;
    if (aqi <= 150)
      return <AlertTriangle className="h-6 w-6 text-orange-600" />;
    return <AlertTriangle className="h-6 w-6 text-red-600" />;
  };

  const getRecommendationIcon = (aqi: number) => {
    if (aqi <= 50) return <Wind className="h-5 w-5 text-green-600" />;
    if (aqi <= 100) return <Users className="h-5 w-5 text-yellow-600" />;
    if (aqi <= 150) return <Shield className="h-5 w-5 text-orange-600" />;
    return <Home className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-32 sm:pt-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,127,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>

      <div className="relative container mx-auto px-4 py-8 max-w-6xl md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                Health Advice Center
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-lg text-slate-600 dark:text-slate-300">
                  AI-Powered Health Recommendations
                </span>
              </div>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
            Get personalized health recommendations based on current air quality
            conditions. Our AI analyzes air quality data to provide tailored
            advice for your safety.
          </p>
        </div>

        {/* Current AQI Status */}
        {currentData && (
          <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-blue-600" />
                    Current Air Quality Status
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchCurrentData}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(currentData.aqi)}
                    <div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white">
                        {currentData.aqi}
                      </div>
                      <div className="text-sm text-slate-500">Current AQI</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getAQIColorClass(currentData.aqi)}>
                      {currentData.status || getAQIStatus(currentData.aqi)}
                    </Badge>
                    <div className="text-xs text-slate-500 mt-1">
                      Updated:{" "}
                      {new Date(currentData.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {currentData.health_advice && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      {getRecommendationIcon(currentData.aqi)}
                      <div>
                        <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Current Recommendation
                        </div>
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          {currentData.health_advice}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Custom AQI Lookup */}
          <div data-aos="fade-up" data-aos-delay="200">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  Custom Health Advice
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enter any AQI value to get specific health recommendations
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="aqi-input">AQI Value (0-500)</Label>
                    <Input
                      id="aqi-input"
                      type="number"
                      placeholder="e.g., 85"
                      value={aqi}
                      onChange={(e) => setAqi(e.target.value)}
                      min="0"
                      max="500"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => fetchHealthAdvice()}
                      disabled={loading || !aqi}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Heart className="h-4 w-4 mr-2" />
                      )}
                      Get Advice
                    </Button>
                  </div>
                </div>

                {healthAdvice && (
                  <div
                    className={`p-4 rounded-lg border-2 ${getAQIColorClass(
                      healthAdvice.aqi
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(healthAdvice.aqi)}
                        <div>
                          <div className="text-2xl font-bold">
                            AQI {healthAdvice.aqi}
                          </div>
                          <div className="text-sm opacity-75">
                            {getAQIStatus(healthAdvice.aqi)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        {getRecommendationIcon(healthAdvice.aqi)}
                        <div>
                          <div className="font-medium mb-1">
                            Health Recommendation:
                          </div>
                          <div className="text-sm leading-relaxed">
                            {healthAdvice.health_advice}
                          </div>
                        </div>
                      </div>
                    </div>

                    {healthAdvice.fallback && (
                      <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                        ⚠️ Using fallback data - ML API not available
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick AQI Reference */}
          <div data-aos="fade-up" data-aos-delay="300">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-500" />
                  AQI Reference Guide
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Click any level to get specific health advice
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonAQILevels.map((level, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getAQIColorClass(
                        level.aqi
                      )}`}
                      onClick={() => fetchHealthAdvice(level.aqi.toString())}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(level.aqi)}
                          <div className="font-medium">{level.label}</div>
                        </div>
                        <div className="text-sm font-bold">AQI {level.aqi}</div>
                      </div>
                      <div className="text-xs opacity-75">
                        {level.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Information */}
        <div className="mt-8" data-aos="fade-up" data-aos-delay="400">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-6 w-6 text-green-500" />
                API Information
              </CardTitle>
            </CardHeader>
            {/* <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">
                    Health Advice Endpoint:
                  </div>
                  <code className="text-xs bg-slate-100 dark:bg-slate-700 p-1 rounded">
                    /api/ml-predictions/health-advice/{"{aqi}"}
                  </code>
                </div>
                <div>
                  <div className="font-medium mb-1">Example Usage:</div>
                  <code className="text-xs bg-slate-100 dark:bg-slate-700 p-1 rounded">
                    GET /api/ml-predictions/health-advice/85
                  </code>
                </div>
                <div>
                  <div className="font-medium mb-1">Current Data:</div>
                  <code className="text-xs bg-slate-100 dark:bg-slate-700 p-1 rounded">
                    GET /api/ml-predictions/current
                  </code>
                </div>
                <div>
                  <div className="font-medium mb-1">Model Accuracy:</div>
                  <Badge className="text-green-600 bg-green-50">99.95%</Badge>
                </div>
              </div>
            </CardContent> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
