"use client";

import { useState } from "react";
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
} from "lucide-react";

interface HealthAdviceData {
  aqi: number;
  health_advice: string;
  fallback?: boolean;
  error?: string;
}

export default function HealthAdviceDemo() {
  const [aqi, setAqi] = useState("");
  const [healthAdvice, setHealthAdvice] = useState<HealthAdviceData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const fetchHealthAdvice = async () => {
    if (!aqi || isNaN(Number(aqi))) {
      alert("Please enter a valid AQI number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/ml-predictions/health-advice/${aqi}`);
      const data = await response.json();
      setHealthAdvice(data);
    } catch (error) {
      console.error("Error fetching health advice:", error);
      setHealthAdvice({
        aqi: Number(aqi),
        health_advice: "Error fetching health advice",
        error: "Network error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-green-600 bg-green-50 border-green-200";
    if (aqi <= 100) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (aqi <= 150) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusIcon = (aqi: number) => {
    if (aqi <= 50) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (aqi <= 100) return <Activity className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-500" />
          <CardTitle>Health Advice by AQI</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Get personalized health recommendations based on Air Quality Index
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="aqi-input">Enter AQI Value</Label>
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
            <Button onClick={fetchHealthAdvice} disabled={loading || !aqi}>
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
            className={`p-4 rounded-lg border-2 ${getAQIColor(
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
              <Badge
                variant="outline"
                className={getAQIColor(healthAdvice.aqi)}
              >
                {getAQIStatus(healthAdvice.aqi)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="font-medium">Health Recommendation:</div>
              <div className="text-sm leading-relaxed">
                {healthAdvice.health_advice}
              </div>
            </div>

            {healthAdvice.fallback && (
              <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                ⚠️ Using fallback data - ML API not available
              </div>
            )}

            {healthAdvice.error && (
              <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                ❌ Error: {healthAdvice.error}
              </div>
            )}
          </div>
        )}

        {/* <div className="text-xs text-gray-500 space-y-1">
          <div>
            <strong>API Endpoint:</strong>{" "}
            <code>/api/ml-predictions/health-advice/{"{aqi}"}</code>
          </div>
          <div>
            <strong>Example:</strong>{" "}
            <code>/api/ml-predictions/health-advice/85</code>
          </div>
          <div>
            <strong>Method:</strong> GET
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
