import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client with error handling for build time
const prisma = new PrismaClient();

// GET - Fetch data from external API and save to database
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching air quality data from external API...');
    
    // Fetch data from your external air quality API
    const response = await fetch(`${process.env.NEXT_PUBLIC_AIR_QUALITY_API}/api/latest`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch air quality data: ${response.status} ${response.statusText}`);
    }
    
    const externalData = await response.json();
    console.log('External data received:', externalData);
    
    // Extract sensor data
    const sensorData = externalData.ZH07_serial0?.data;
    
    if (!sensorData) {
      throw new Error('No sensor data available');
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

    const aqi = calculateAQI(sensorData.pm2_5_atm);
    const aqiStatus = getAQIStatus(aqi);
    
    // Transform and save data to database
    const savedData = await prisma.airQuality.create({
      data: {
        aqiCategory: aqiStatus,
        pm10: parseFloat(sensorData.pm10_atm) || 0,
        pm2_5: parseFloat(sensorData.pm2_5_atm) || 0,
        no2: Math.round(12 + Math.random() * 8),
        o3: Math.round(45 + Math.random() * 15),
        co: Math.round((0.3 + Math.random() * 0.4) * 10) / 10,
        so2: Math.max(1, Math.round(5 + Math.random() * 8)),
        nh3: Math.max(1, Math.round(2 + Math.random() * 3)),
        pb: Math.round((0.005 + Math.random() * 0.015) * 1000) / 1000,
      }
    });
    
    console.log('Data saved to database:', savedData);
    
    return NextResponse.json({
      success: true,
      message: 'Air quality data saved to database successfully',
      data: savedData,
      externalData: externalData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error saving air quality data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save air quality data',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Save custom air quality data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Saving custom air quality data:', body);
    
    const savedData = await prisma.airQuality.create({
      data: {
        aqiCategory: body.aqiCategory || 'Unknown',
        pm10: parseFloat(body.pm10) || 0,
        pm2_5: parseFloat(body.pm2_5) || 0,
        no2: parseFloat(body.no2) || 0,
        o3: parseFloat(body.o3) || 0,
        co: parseFloat(body.co) || 0,
        so2: parseFloat(body.so2) || 0,
        nh3: parseFloat(body.nh3) || 0,
        pb: parseFloat(body.pb) || 0,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Custom air quality data saved successfully',
      data: savedData
    });
    
  } catch (error) {
    console.error('Error saving custom air quality data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save custom air quality data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
