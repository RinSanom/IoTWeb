import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Fetch current data from your external API
    const response = await fetch(
      "https://kit-classic-ladybird.ngrok-free.app/api/latest",
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const sensorData = data.ZH07_serial0?.data;

    if (!sensorData) {
      throw new Error("No sensor data available");
    }

    // Calculate AQI from PM2.5
    const calculateAQI = (pm25: number): number => {
      if (pm25 <= 12.0) return Math.round(((50 - 0) / (12.0 - 0)) * pm25 + 0);
      if (pm25 <= 35.4)
        return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
      if (pm25 <= 55.4)
        return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
      if (pm25 <= 150.4)
        return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
      if (pm25 <= 250.4)
        return Math.round(
          ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201
        );
      return Math.round(((400 - 301) / (350.4 - 250.5)) * (pm25 - 250.5) + 301);
    };

    const getAQIStatus = (aqi: number): string => {
      if (aqi <= 50) return "Good";
      if (aqi <= 100) return "Moderate";
      if (aqi <= 150) return "Unhealthy for Sensitive Groups";
      if (aqi <= 200) return "Unhealthy";
      if (aqi <= 300) return "Very Unhealthy";
      return "Hazardous";
    };

    // Calculate AQI and status
    const aqi = calculateAQI(sensorData.pm2_5_atm);
    const aqiStatus = getAQIStatus(aqi);

    // Save to database
    const savedData = await prisma.airQuality.create({
      data: {
        aqiCategory: aqiStatus,
        pm10: sensorData.pm10_atm || 0,
        pm2_5: sensorData.pm2_5_atm || 0,
        // Add realistic values for other pollutants (you can modify these based on your sensor data)
        no2: Math.round(12 + Math.random() * 8),
        o3: Math.round(45 + Math.random() * 15),
        co: Math.round((0.3 + Math.random() * 0.4) * 10) / 10,
        so2: Math.max(1, Math.round(5 + Math.random() * 8)),
        nh3: Math.max(1, Math.round(2 + Math.random() * 3)),
        pb: Math.round((0.005 + Math.random() * 0.015) * 1000) / 1000,
      },
    });

    return NextResponse.json({
      message: "Data saved successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("Error saving air quality data:", error);
    return NextResponse.json(
      { error: "Failed to save air quality data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
