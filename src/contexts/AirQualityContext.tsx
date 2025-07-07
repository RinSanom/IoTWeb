"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate data update with random values
      setData((prev) => ({
        ...prev,
        aqi: Math.floor(Math.random() * 100) + 50,
        lastUpdated: "Just now",
      }));
      setError(null);
    } catch (error) {
      setError("Failed to fetch air quality data");
      console.error("Error fetching air quality data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Simulate real-time updates every 5 minutes
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        aqi: Math.floor(Math.random() * 100) + 50,
        lastUpdated: `${Math.floor(Math.random() * 5) + 1} minutes ago`,
      }));
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

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
