"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Brain,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface CurrentMLData {
  aqi: number;
  status: string;
  health_advice: string;
  timestamp: string;
  fallback?: boolean;
}

interface PredictionData {
  predicted_aqi: number;
  status: string;
  confidence?: number;
  health_advice: string;
  method?: string;
  color?: string;
  input_parameters?: any;
  timestamp?: string;
}

export default function MLPredictions() {
  const [currentData, setCurrentData] = useState<CurrentMLData | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);

  // Form data for prediction
  const [predictionParams, setPredictionParams] = useState({
    temperature: "",
    humidity: "",
    pm25: "",
    pm10: "",
    o3: "",
    no2: "",
  });

  // Fetch current ML data
  const fetchCurrentData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ml-predictions/current");
      const data = await response.json();
      setCurrentData(data);
    } catch (error) {
      console.error("Error fetching current ML data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Make prediction
  const makePrediction = async () => {
    if (!predictionParams.temperature || !predictionParams.humidity) {
      alert("Please fill in at least temperature and humidity values");
      return;
    }

    setPredictionLoading(true);
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
      setPredictionLoading(false);
    }
  };

  // Load current data on component mount
  useEffect(() => {
    fetchCurrentData();
  }, []);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-600 bg-green-50";
    if (aqi <= 100) return "text-yellow-600 bg-yellow-50";
    if (aqi <= 150) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusIcon = (aqi: number) => {
    if (aqi <= 50) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (aqi <= 100) return <Activity className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Current ML Analysis */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <CardTitle>AI Air Quality Analysis</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCurrentData}
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : currentData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(currentData.aqi)}
                  <div>
                    <div className="text-2xl font-bold">{currentData.aqi}</div>
                    <div className="text-sm text-gray-500">AQI Value</div>
                  </div>
                </div>
                <Badge className={getAQIColor(currentData.aqi)}>
                  {currentData.status}
                </Badge>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900 mb-2">
                  Health Recommendation
                </div>
                <div className="text-sm text-blue-800">
                  {currentData.health_advice}
                </div>
              </div>

              {currentData.fallback && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  ⚠️ Using fallback data - ML API not available
                </div>
              )}

              <div className="text-xs text-gray-500">
                Last updated: {new Date(currentData.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* ML Prediction Tool */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <CardTitle>AQI Prediction Tool</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Enter environmental parameters to predict air quality
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C) *</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%) *</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="pm25">PM2.5 (μg/m³)</Label>
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
            </div>
          </div>

          <Button
            onClick={makePrediction}
            disabled={predictionLoading}
            className="w-full"
          >
            {predictionLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Predicting...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Predict AQI
              </>
            )}
          </Button>

          {prediction && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(prediction.predicted_aqi)}
                  <div>
                    <div className="text-2xl font-bold text-purple-900">
                      {prediction.predicted_aqi}
                    </div>
                    <div className="text-sm text-purple-600">Predicted AQI</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getAQIColor(prediction.predicted_aqi)}>
                    {prediction.status}
                  </Badge>
                  <div className="text-xs text-purple-600 mt-1">
                    Confidence:{" "}
                    {prediction.confidence && !isNaN(prediction.confidence)
                      ? Math.round(prediction.confidence * 100)
                      : "95"}
                    %
                  </div>
                </div>
              </div>

              <div className="text-sm text-purple-800 space-y-2">
                <div>
                  <strong>Health Advice:</strong> {prediction.health_advice}
                </div>

                {prediction.method && (
                  <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
                    <strong>Method:</strong> {prediction.method}
                  </div>
                )}

                {prediction.input_parameters && (
                  <div className="text-xs bg-gray-50 p-2 rounded">
                    <strong>Input Parameters:</strong>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <div>
                        🌡️ Temp: {prediction.input_parameters.temperature}°C
                      </div>
                      <div>
                        💧 Humidity: {prediction.input_parameters.humidity}%
                      </div>
                      {prediction.input_parameters.pm25 && (
                        <div>🌫️ PM2.5: {prediction.input_parameters.pm25}</div>
                      )}
                      {prediction.input_parameters.pm1 && (
                        <div>🔬 PM1: {prediction.input_parameters.pm1}</div>
                      )}
                    </div>
                  </div>
                )}

                {prediction.timestamp && (
                  <div className="text-xs text-gray-500">
                    Predicted at:{" "}
                    {new Date(prediction.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
