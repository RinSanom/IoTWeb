import { NextResponse } from "next/server";

export async function GET() {
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

    // Generate historical data (simulated based on current reading with variations)
    const currentTime = new Date();
    const historicalData = [];

    for (let i = 0; i < 24; i++) {
      const timeOffset = i * 60000; // 1 minute intervals
      const variation = (Math.random() - 0.5) * 0.3; // ±30% variation
      const timeBasedVariation = Date.now() / 30000 - i * 0.1; // Time-based changes

      const pm25 = Math.max(0, sensorData.pm2_5_atm * (1 + variation));
      const pm10 = Math.max(0, sensorData.pm10_atm * (1 + variation));
      const aqi = calculateAQI(pm25);

      historicalData.unshift({
        aqi_category: getAQIStatus(aqi),
        pm10: Math.round(pm10 * 10) / 10,
        pm2_5: Math.round(pm25 * 10) / 10,
        // Dynamic gas pollutants with realistic variations over time
        no2: Math.round(
          12 + Math.sin(timeBasedVariation) * 8 + Math.random() * 4
        ),
        o3: Math.round(
          45 + Math.cos(timeBasedVariation + 1) * 15 + Math.random() * 8
        ),
        co:
          Math.round(
            (0.3 +
              Math.sin(timeBasedVariation + 2) * 0.4 +
              Math.random() * 0.15) *
              10
          ) / 10,
        so2: Math.max(
          1,
          Math.round(
            5 + Math.cos(timeBasedVariation + 3) * 8 + Math.random() * 3
          )
        ),
        nh3: Math.max(
          1,
          Math.round(
            2 + Math.sin(timeBasedVariation + 4) * 3 + Math.random() * 1.5
          )
        ),
        pb: Math.max(
          0,
          Math.round(
            (0.005 +
              Math.cos(timeBasedVariation + 5) * 0.015 +
              Math.random() * 0.008) *
              1000
          ) / 1000
        ),
        timestamp: new Date(currentTime.getTime() - timeOffset).toISOString(),
      });
    }

    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=5"); // Cache for 5 seconds for dynamic updates
    headers.set("Content-Type", "application/json");

    return new NextResponse(JSON.stringify(historicalData), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error fetching air quality data:", error);

    // Fallback to mock data if API is unavailable
    const fallbackData = [];
    const currentTime = new Date();

    for (let i = 0; i < 24; i++) {
      const timeOffset = i * 60000;
      fallbackData.unshift({
        aqi_category: "Unknown",
        pm10: 0,
        pm2_5: 0,
        no2: 0,
        o3: 0,
        co: 0,
        so2: 0,
        nh3: 0,
        pb: 0,
        timestamp: new Date(currentTime.getTime() - timeOffset).toISOString(),
      });
    }

    return NextResponse.json(fallbackData, { status: 200 });
  }
}
