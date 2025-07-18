import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In production, this would fetch from your actual air quality sensors/database
    // For demo purposes, we'll generate realistic data
    
    const baseAQI = 75; // Base AQI value
    const variation = Math.random() * 100 - 50; // -50 to +50 variation
    const currentAQI = Math.max(0, Math.min(300, Math.round(baseAQI + variation)));
    
    const getAQIStatus = (aqi: number): string => {
      if (aqi <= 50) return "Good";
      if (aqi <= 100) return "Moderate";
      if (aqi <= 150) return "Unhealthy for Sensitive Groups";
      if (aqi <= 200) return "Unhealthy";
      if (aqi <= 300) return "Very Unhealthy";
      return "Hazardous";
    };

    // Calculate individual pollutant values based on AQI
    const latestData = {
      aqi: currentAQI,
      aqi_category: getAQIStatus(currentAQI),
      status: getAQIStatus(currentAQI),
      location: "Phnom Penh, Cambodia",
      pm10: Math.round(currentAQI * 0.6 + Math.random() * 15),
      pm2_5: Math.round(currentAQI * 0.4 + Math.random() * 10),
      no2: Math.round(currentAQI * 0.3 + Math.random() * 8),
      o3: Math.round(currentAQI * 0.8 + Math.random() * 20),
      co: Number((currentAQI * 0.01 + Math.random() * 0.5).toFixed(1)),
      so2: Math.round(currentAQI * 0.2 + Math.random() * 5),
      nh3: Math.round(currentAQI * 0.15 + Math.random() * 3),
      pb: Number((currentAQI * 0.001 + Math.random() * 0.05).toFixed(2)),
      temperature: Math.round(25 + Math.random() * 10), // 25-35°C
      humidity: Math.round(60 + Math.random() * 30), // 60-90%
      pressure: Math.round(1010 + Math.random() * 20), // 1010-1030 hPa
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    headers.set('Content-Type', 'application/json');
    
    return new NextResponse(JSON.stringify(latestData), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching latest air quality data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest air quality data' },
      { status: 500 }
    );
  }
}
