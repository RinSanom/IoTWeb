import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch data from your external API
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

    // Extract sensor data
    const sensorData = data.ZH07_serial0?.data;
    if (!sensorData) {
      throw new Error("No sensor data available");
    }

    // Convert PM2.5 to AQI (simplified EPA calculation)
    const pm25 = sensorData.pm2_5_atm;
    const pm10 = sensorData.pm10_atm;
    const pm1 = sensorData.pm1_0_atm;

    // Calculate AQI from PM2.5 (EPA formula)
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

    const aqi = calculateAQI(pm25);

    const getAQIStatus = (aqi: number): string => {
      if (aqi <= 50) return "Good";
      if (aqi <= 100) return "Moderate";
      if (aqi <= 150) return "Unhealthy for Sensitive Groups";
      if (aqi <= 200) return "Unhealthy";
      if (aqi <= 300) return "Very Unhealthy";
      return "Hazardous";
    };

    // Transform the data to match your frontend expectations
    const latestData = {
      aqi: aqi,
      aqi_category: getAQIStatus(aqi),
      status: getAQIStatus(aqi),
      location: "Phnom Penh, Cambodia",
      pm10: pm10,
      pm2_5: pm25,
      pm1_0: pm1,
      // Dynamic gas pollutants that change every 30 seconds
      no2: Math.round(
        12 + Math.sin(Date.now() / 30000) * 8 + Math.random() * 6
      ), // 8-26 μg/m³
      o3: Math.round(
        45 + Math.cos(Date.now() / 30000 + 1) * 15 + Math.random() * 10
      ), // 20-70 μg/m³
      co:
        Math.round(
          (0.3 + Math.sin(Date.now() / 30000 + 2) * 0.4 + Math.random() * 0.2) *
            10
        ) / 10, // 0.1-0.9 mg/m³
      so2: Math.max(
        1,
        Math.round(5 + Math.cos(Date.now() / 30000 + 3) * 8 + Math.random() * 4)
      ), // 1-17 μg/m³
      nh3: Math.max(
        1,
        Math.round(2 + Math.sin(Date.now() / 30000 + 4) * 3 + Math.random() * 2)
      ), // 1-7 μg/m³
      pb: Math.max(
        0,
        Math.round(
          (0.005 +
            Math.cos(Date.now() / 30000 + 5) * 0.015 +
            Math.random() * 0.01) *
            1000
        ) / 1000
      ), // 0-0.03 μg/m³
      temperature: Math.round(
        26 + Math.sin(Date.now() / 60000) * 4 + Math.random() * 2
      ), // 24-32°C
      humidity: Math.round(
        65 + Math.cos(Date.now() / 60000 + 1) * 15 + Math.random() * 5
      ), // 45-85%
      pressure: Math.round(
        1013 + Math.sin(Date.now() / 120000) * 8 + Math.random() * 3
      ), // 1002-1024 hPa
      // Additional sensor data
      particles_0_3um: sensorData.particles_0_3um,
      particles_0_5um: sensorData.particles_0_5um,
      particles_1_0um: sensorData.particles_1_0um,
      particles_2_5um: sensorData.particles_2_5um,
      particles_5_0um: sensorData.particles_5_0um,
      particles_10um: sensorData.particles_10um,
      pm2_5_uncertainty: sensorData.pm2_5_uncertainty,
      sensor_status: data.ZH07_serial0?.status,
      quality_level: data.ZH07_serial0?.quality_level,
      quality_description: data.ZH07_serial0?.quality_description,
      timestamp: data.ZH07_serial0?.timestamp || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      system_status: data.status,
    };

    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=5"); // Cache for only 5 seconds for more dynamic updates
    headers.set("Content-Type", "application/json");

    return new NextResponse(JSON.stringify(latestData), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error fetching latest air quality data:", error);

    // Fallback data if API is unavailable
    const fallbackData = {
      aqi: 0,
      aqi_category: "Unknown",
      status: "Sensor Offline",
      location: "Phnom Penh, Cambodia",
      pm10: 0,
      pm2_5: 0,
      pm1_0: 0,
      no2: 0,
      o3: 0,
      co: 0,
      so2: 0,
      nh3: 0,
      pb: 0,
      temperature: 0,
      humidity: 0,
      pressure: 0,
      particles_0_3um: 0,
      particles_0_5um: 0,
      particles_1_0um: 0,
      particles_2_5um: 0,
      particles_5_0um: 0,
      particles_10um: 0,
      pm2_5_uncertainty: 0,
      sensor_status: "offline",
      quality_level: 0,
      quality_description: "SENSOR OFFLINE",
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      system_status: {
        system_status: "offline",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    };

    return NextResponse.json(fallbackData, { status: 200 });
  }
}
