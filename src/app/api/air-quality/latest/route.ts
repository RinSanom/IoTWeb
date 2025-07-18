import { NextResponse } from 'next/server';

interface SensorData {
  co_ppm: number;
  h2s_ppm: number;
  ch4_ppm: number;
  o2_percent: number;
}

interface SensorReading {
  timestamp: string;
  sensor_id: string;
  sensor_type: string;
  data: SensorData;
  status: string;
  quality_level: number;
  quality_description: string;
}

interface ApiResponse {
  status: {
    system_status: string;
    timestamp: string;
    client_id: string;
    active_sensors: number;
    readings_this_cycle: number;
    uptime_cycles: number;
  };
  [key: string]: any; // For dynamic sensor keys like ZCE04B_ttyUSB0
  alerts?: {
    sensor_id: string;
    alert_type: string;
    message: string;
    severity: string;
    timestamp: string;
  };
}

// Function to calculate AQI category based on quality level
const getAQICategory = (qualityLevel: number): string => {
  switch (qualityLevel) {
    case 1:
      return "Good";
    case 2:
      return "Moderate";
    case 3:
      return "Unhealthy for Sensitive Groups";
    case 4:
      return "Unhealthy";
    case 5:
      return "Very Unhealthy";
    case 6:
      return "Hazardous";
    default:
      return "Unknown";
  }
};

// Convert gas readings to equivalent air quality values (approximate conversions)
const convertGasToAirQuality = (sensorData: SensorData) => {
  // These are rough approximations - you may need to adjust based on your requirements
  const co_mg_m3 = sensorData.co_ppm * 1.165; // CO conversion from ppm to mg/m³
  const h2s_ug_m3 = sensorData.h2s_ppm * 1400; // H2S conversion from ppm to µg/m³
  
  return {
    pm10: Math.min(Math.max(co_mg_m3 * 10, 10), 500), // Scale CO to PM10-like values
    pm2_5: Math.min(Math.max(h2s_ug_m3 / 100, 5), 300), // Scale H2S to PM2.5-like values
    no2: Math.min(Math.max(sensorData.h2s_ppm * 5, 10), 200), // H2S as NO2 proxy
    o3: Math.min(Math.max(sensorData.o2_percent * 5, 50), 300), // O2 as O3 proxy
    co: co_mg_m3,
    so2: Math.min(Math.max(sensorData.h2s_ppm * 2, 5), 100), // H2S as SO2 proxy
    nh3: Math.min(Math.max(sensorData.ch4_ppm, 1), 50), // CH4 as NH3 proxy
    pb: 0.1, // Default low value for lead
  };
};

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_AIR_QUALITY_API;
    
    if (!apiUrl) {
      // Fallback to mock data if no API URL is configured
      const mockData = {
        aqi_category: "Moderate",
        pm10: 45,
        pm2_5: 25,
        no2: 30,
        o3: 85,
        co: 1.2,
        so2: 15,
        nh3: 8,
        pb: 0.1,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(mockData);
    }

    const response = await fetch(`${apiUrl}/api/latest`, {
      headers: {
        'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
        'User-Agent': 'Mozilla/5.0 (compatible; AirQualityBot/1.0)',
      },
      // Add timeout and other options
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    // Find the sensor data (excluding status and alerts)
    const sensorKeys = Object.keys(data).filter(key => 
      key !== 'status' && key !== 'alerts' && typeof data[key] === 'object'
    );

    if (sensorKeys.length === 0) {
      throw new Error('No sensor data found');
    }

    // Use the first sensor's data
    const sensorKey = sensorKeys[0];
    const sensorReading: SensorReading = data[sensorKey];
    
    if (!sensorReading || !sensorReading.data) {
      throw new Error('Invalid sensor data structure');
    }

    // Convert sensor data to air quality format
    const airQualityValues = convertGasToAirQuality(sensorReading.data);
    
    // Transform to expected format
    const latestData = {
      aqi_category: sensorReading.quality_description || getAQICategory(sensorReading.quality_level),
      pm10: Math.round(airQualityValues.pm10 * 100) / 100,
      pm2_5: Math.round(airQualityValues.pm2_5 * 100) / 100,
      no2: Math.round(airQualityValues.no2 * 100) / 100,
      o3: Math.round(airQualityValues.o3 * 100) / 100,
      co: Math.round(airQualityValues.co * 100) / 100,
      so2: Math.round(airQualityValues.so2 * 100) / 100,
      nh3: Math.round(airQualityValues.nh3 * 100) / 100,
      pb: airQualityValues.pb,
      timestamp: sensorReading.timestamp,
      // Additional sensor-specific data
      sensor_info: {
        sensor_id: sensorReading.sensor_id,
        sensor_type: sensorReading.sensor_type,
        status: sensorReading.status,
        quality_level: sensorReading.quality_level,
        raw_data: sensorReading.data,
      },
      alerts: data.alerts || null,
      system_status: data.status,
    };
    
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute for real-time data
    headers.set('Content-Type', 'application/json');
    
    return new NextResponse(JSON.stringify(latestData), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching latest air quality data:', error);
    
    // Return fallback mock data on error
    const fallbackData = {
      aqi_category: "Moderate",
      pm10: 45,
      pm2_5: 25,
      no2: 30,
      o3: 85,
      co: 1.2,
      so2: 15,
      nh3: 8,
      pb: 0.1,
      timestamp: new Date().toISOString(),
      error: 'Using fallback data due to API error',
      error_details: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(fallbackData, { status: 200 });
  }
}
