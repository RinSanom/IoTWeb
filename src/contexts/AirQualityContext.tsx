"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { notificationService } from "@/lib/services/notificationService";

interface AirQualityData {
  aqi: number;
  status: string;
  location: string;
  lastUpdated: string;
  pollutants: {
    pm25: { value: number; unit: string; status: string };
    pm10: { value: number; unit: string; status: string };
    o3: { value: number; unit: string; status: string };
    no2: { value: number; unit: string; status: string };
    so2: { value: number; unit: string; status: string };
    co: { value: number; unit: string; status: string };
  };
}

interface AirQualityContextType {
  data: AirQualityData;
  isLoading: boolean;
  error: string | null;
  refreshData: () => void;
}

const AirQualityContext = createContext<AirQualityContextType | undefined>(
  undefined
);

export function AirQualityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<AirQualityData>({
    aqi: 85,
    status: "Moderate",
    location: "Phnom Penh, Cambodia",
    lastUpdated: "2 minutes ago",
    pollutants: {
      pm25: { value: 35, unit: "μg/m³", status: "Good" },
      pm10: { value: 50, unit: "μg/m³", status: "Moderate" },
      o3: { value: 120, unit: "μg/m³", status: "Moderate" },
      no2: { value: 40, unit: "μg/m³", status: "Good" },
      so2: { value: 15, unit: "μg/m³", status: "Good" },
      co: { value: 1.2, unit: "mg/m³", status: "Good" },
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousAQI, setPreviousAQI] = useState<number>(0);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Store previous AQI for comparison
      setPreviousAQI(data.aqi);

      // Simulate API call - replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate new AQI value (simulate air quality sensor data)
      const newAQI = Math.floor(Math.random() * 150) + 50; // Range: 50-200
      const newStatus = getAQIStatus(newAQI);

      const newData = {
        ...data,
        aqi: newAQI,
        status: newStatus,
        lastUpdated: "Just now",
      };

      setData(newData);
      
      // Check if notification should be sent
      await checkAndSendNotification(newAQI, newData);
      
      setError(null);
    } catch (error) {
      setError("Failed to fetch air quality data");
      console.error("Error fetching air quality data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const checkAndSendNotification = async (newAQI: number, newData: AirQualityData) => {
    try {
      // Get user's notification threshold from localStorage
      const savedThreshold = localStorage.getItem('air-quality-threshold');
      const threshold = savedThreshold ? parseInt(savedThreshold, 10) : 100;
      
      const notificationsEnabled = localStorage.getItem('air-quality-notifications-enabled');
      const isEnabled = notificationsEnabled ? JSON.parse(notificationsEnabled) : false;

      // Only send notification if:
      // 1. Notifications are enabled
      // 2. New AQI exceeds threshold
      // 3. AQI has increased significantly (to avoid spam)
      if (isEnabled && newAQI > threshold && newAQI > previousAQI + 10) {
        await notificationService.checkAirQualityAndNotify(newAQI, newData);
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  useEffect(() => {
    // Initialize notification service
    notificationService.initialize().catch(console.error);

    // Simulate real-time updates every 5 minutes
    const interval = setInterval(async () => {
      const newAQI = Math.floor(Math.random() * 150) + 50;
      const newStatus = getAQIStatus(newAQI);
      
      const newData = {
        ...data,
        aqi: newAQI,
        status: newStatus,
        lastUpdated: `${Math.floor(Math.random() * 5) + 1} minutes ago`,
      };

      setPreviousAQI(data.aqi);
      setData(newData);
      
      // Check for notifications on automatic updates too
      await checkAndSendNotification(newAQI, newData);
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [data.aqi, previousAQI]); // Add dependencies to prevent stale closures

  return (
    <AirQualityContext.Provider value={{ data, isLoading, error, refreshData }}>
      {children}
    </AirQualityContext.Provider>
  );
}

export function useAirQuality() {
  const context = useContext(AirQualityContext);
  if (context === undefined) {
    throw new Error("useAirQuality must be used within an AirQualityProvider");
  }
  return context;
}
