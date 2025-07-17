import { NextResponse } from 'next/server';

// Mock data for testing
const mockAirQualityData = [
  {
    aqi_category: "Good",
    pm10: 25,
    pm2_5: 15,
    no2: 20,
    o3: 80,
    co: 0.5,
    so2: 10,
    nh3: 5,
    pb: 0.1,
    timestamp: new Date(Date.now() - 60000).toISOString()
  },
  {
    aqi_category: "Moderate",
    pm10: 35,
    pm2_5: 25,
    no2: 30,
    o3: 95,
    co: 0.8,
    so2: 15,
    nh3: 8,
    pb: 0.2,
    timestamp: new Date(Date.now() - 120000).toISOString()
  },
  {
    aqi_category: "Good",
    pm10: 20,
    pm2_5: 12,
    no2: 18,
    o3: 75,
    co: 0.4,
    so2: 8,
    nh3: 4,
    pb: 0.1,
    timestamp: new Date(Date.now() - 180000).toISOString()
  },
  {
    aqi_category: "Moderate",
    pm10: 40,
    pm2_5: 28,
    no2: 35,
    o3: 100,
    co: 0.9,
    so2: 18,
    nh3: 10,
    pb: 0.2,
    timestamp: new Date(Date.now() - 240000).toISOString()
  },
  {
    aqi_category: "Good",
    pm10: 22,
    pm2_5: 14,
    no2: 22,
    o3: 85,
    co: 0.6,
    so2: 12,
    nh3: 6,
    pb: 0.1,
    timestamp: new Date(Date.now() - 300000).toISOString()
  }
];

// Generate more mock data for history
const generateMockData = () => {
  const data = [];
  const categories = ["Good", "Moderate", "Good", "Moderate", "Good"];
  
  for (let i = 0; i < 48; i++) {
    data.push({
      aqi_category: categories[i % categories.length],
      pm10: Math.floor(Math.random() * 30) + 15,
      pm2_5: Math.floor(Math.random() * 20) + 8,
      no2: Math.floor(Math.random() * 25) + 15,
      o3: Math.floor(Math.random() * 40) + 60,
      co: Math.round((Math.random() * 0.8 + 0.2) * 10) / 10,
      so2: Math.floor(Math.random() * 15) + 5,
      nh3: Math.floor(Math.random() * 8) + 2,
      pb: Math.round((Math.random() * 0.2 + 0.1) * 10) / 10,
      timestamp: new Date(Date.now() - (i * 60000)).toISOString()
    });
  }
  
  return data;
};

export async function GET() {
  try {
    // In a real implementation, this would fetch from your MQTT/sensor backend
    // For now, return mock data
    const mockData = generateMockData();
    
    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch air quality data' },
      { status: 500 }
    );
  }
}
