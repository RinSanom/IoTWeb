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
  [key: string]: any;
  alerts?: {
    sensor_id: string;
    alert_type: string;
    message: string;
    severity: string;
    timestamp: string;
  };
}

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_AIR_QUALITY_API;
    
    if (!apiUrl) {
      return NextResponse.json({
        status: {
          system_status: "offline",
          timestamp: new Date().toISOString(),
          client_id: "fallback_system",
          active_sensors: 0,
          readings_this_cycle: 0,
          uptime_cycles: 0
        },
        error: "API URL not configured"
      });
    }

    const response = await fetch(`${apiUrl}/api/latest`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'Mozilla/5.0 (compatible; AirQualityBot/1.0)',
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    // Return the raw sensor data for components that need it
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=30'); // Cache for 30 seconds for real-time data
    headers.set('Content-Type', 'application/json');
    
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers
    });
    
  } catch (error) {
    console.error('Error fetching real-time sensor data:', error);
    
    // Return fallback status
    const fallbackData = {
      status: {
        system_status: "error",
        timestamp: new Date().toISOString(),
        client_id: "fallback_system",
        active_sensors: 0,
        readings_this_cycle: 0,
        uptime_cycles: 0
      },
      error: 'Failed to fetch sensor data',
      error_details: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(fallbackData, { status: 200 });
  }
}
