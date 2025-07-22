"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Settings, Check, AlertTriangle, Info } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useGetLatestAirQualityQuery } from "@/lib/services/airQualityApi";

interface AlertThreshold {
  id: string;
  name: string;
  aqiLevel: string;
  aqiRange: string;
  color: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string;
}

export default function AlertSettingsClient() {
  const [mounted, setMounted] = useState(false);
  const [alertThresholds, setAlertThresholds] = useState<AlertThreshold[]>([
    {
      id: "good",
      name: "Good Air Quality",
      aqiLevel: "Good",
      aqiRange: "AQI 0-50",
      color: "bg-green-500",
      icon: <Check className="h-4 w-4" />,
      enabled: true, // You wanted GOOD to alert by default
      description: "Air quality is satisfactory",
    },
    {
      id: "moderate",
      name: "Moderate Air Quality",
      aqiLevel: "Moderate",
      aqiRange: "AQI 51-100",
      color: "bg-yellow-500",
      icon: <Info className="h-4 w-4" />,
      enabled: false,
      description: "Air quality is acceptable for most people",
    },
    {
      id: "unhealthy_sensitive",
      name: "Unhealthy for Sensitive Groups",
      aqiLevel: "Unhealthy for Sensitive Groups",
      aqiRange: "AQI 101-150",
      color: "bg-orange-500",
      icon: <AlertTriangle className="h-4 w-4" />,
      enabled: false,
      description: "Sensitive individuals may experience health effects",
    },
    {
      id: "unhealthy",
      name: "Unhealthy",
      aqiLevel: "Unhealthy",
      aqiRange: "AQI 151-200",
      color: "bg-red-500",
      icon: <AlertTriangle className="h-4 w-4" />,
      enabled: true,
      description: "Everyone may begin to experience health effects",
    },
    {
      id: "very_unhealthy",
      name: "Very Unhealthy",
      aqiLevel: "Very Unhealthy",
      aqiRange: "AQI 201-300",
      color: "bg-purple-500",
      icon: <AlertTriangle className="h-4 w-4" />,
      enabled: true,
      description: "Health alert: everyone affected",
    },
    {
      id: "hazardous",
      name: "Hazardous",
      aqiLevel: "Hazardous",
      aqiRange: "AQI 301+",
      color: "bg-red-800",
      icon: <AlertTriangle className="h-4 w-4" />,
      enabled: true,
      description: "Emergency conditions",
    },
  ]);

  const [lastNotifiedLevel, setLastNotifiedLevel] = useState<string>("");

  const {
    permission,
    isSupported,
    isSubscribed,
    enableNotifications,
    testNotification,
    checkAirQualityAndNotify,
  } = useNotifications();

  const { data: latestData } = useGetLatestAirQualityQuery(undefined, {
    pollingInterval: 5000,
  });

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Save settings to localStorage (only on client)
  useEffect(() => {
    if (mounted) {
      // Only save serializable data (exclude React icons)
      const serializableThresholds = alertThresholds.map(
        ({ icon, ...rest }) => rest
      );
      localStorage.setItem(
        "alertThresholds",
        JSON.stringify(serializableThresholds)
      );
    }
  }, [alertThresholds, mounted]);

  // Load settings from localStorage (only on client)
  useEffect(() => {
    if (mounted) {
      const savedThresholds = localStorage.getItem("alertThresholds");
      if (savedThresholds) {
        try {
          const parsed = JSON.parse(savedThresholds);
          // Restore the icons by mapping with the original thresholds
          const restoredThresholds = alertThresholds.map((original) => {
            const saved = parsed.find((p: any) => p.id === original.id);
            return saved
              ? { ...original, ...saved, icon: original.icon }
              : original;
          });
          setAlertThresholds(restoredThresholds);
        } catch (error) {
          console.error("Failed to load alert settings:", error);
        }
      }
    }
  }, [mounted]);

  // Check for alerts when air quality data changes
  useEffect(() => {
    if (latestData && latestData.aqi_category) {
      const currentLevel = latestData.aqi_category;
      const threshold = alertThresholds.find(
        (t) => t.aqiLevel === currentLevel
      );

      if (
        threshold &&
        threshold.enabled &&
        currentLevel !== lastNotifiedLevel
      ) {
        // Send notification
        if (permission === "granted" && isSubscribed) {
          checkAirQualityAndNotify(latestData.aqi || 0, {
            level: currentLevel,
            aqi: latestData.aqi,
            pm25: latestData.pm2_5,
            location: latestData.location || "Phnom Penh, Cambodia",
          });
        }

        // Show browser notification as fallback
        if (permission === "granted" && "Notification" in window) {
          new Notification(`Air Quality Alert: ${threshold.name}`, {
            body: `AQI: ${latestData.aqi || "N/A"} - ${threshold.description}`,
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-72x72.png",
            tag: "air-quality-alert",
            requireInteraction: true,
          });
        }

        setLastNotifiedLevel(currentLevel);
      }
    }
  }, [
    latestData,
    alertThresholds,
    permission,
    isSubscribed,
    lastNotifiedLevel,
    checkAirQualityAndNotify,
  ]);

  const toggleThreshold = (id: string) => {
    setAlertThresholds((prev) =>
      prev.map((threshold) =>
        threshold.id === id
          ? { ...threshold, enabled: !threshold.enabled }
          : threshold
      )
    );
  };

  const handleEnableNotifications = async () => {
    const success = await enableNotifications();
    if (success) {
      console.log("Notifications enabled successfully");
    }
  };

  // Show loading state during hydration
  if (!mounted) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Alert Settings
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Loading...
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/20">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Alert Settings
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Configure when to receive air quality notifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={permission === "granted" ? "default" : "secondary"}>
              {permission === "granted" ? "Enabled" : "Disabled"}
            </Badge>
            {permission !== "granted" && (
              <Button onClick={handleEnableNotifications} size="sm">
                Enable Notifications
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Current Air Quality
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {latestData
                  ? `${latestData.aqi_category} (AQI: ${
                      latestData.aqi || "N/A"
                    })`
                  : "Loading..."}
              </p>
            </div>
            <Button onClick={testNotification} variant="outline" size="sm">
              Test Notification
            </Button>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Alert Thresholds
          </h3>

          <div className="grid gap-3">
            {alertThresholds.map((threshold) => (
              <div
                key={threshold.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${threshold.color} text-white`}
                  >
                    {threshold.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{threshold.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {threshold.aqiRange}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {threshold.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`alert-${threshold.id}`}
                    checked={threshold.enabled}
                    onCheckedChange={() => toggleThreshold(threshold.id)}
                  />
                  <Label htmlFor={`alert-${threshold.id}`} className="sr-only">
                    Enable {threshold.name} alerts
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Status */}
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-medium mb-2">Notification Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Browser Support:</span>
              <Badge variant={isSupported ? "default" : "destructive"}>
                {isSupported ? "Supported" : "Not Supported"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Permission:</span>
              <Badge
                variant={permission === "granted" ? "default" : "secondary"}
              >
                {permission}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Push Notifications:</span>
              <Badge variant={isSubscribed ? "default" : "secondary"}>
                {isSubscribed ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
