import { NextRequest, NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const response = await fetch(`${ML_API_BASE}/api/forecast/hourly`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`ML API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match expected format
    const transformedData = {
      forecast:
        data.data?.forecast?.map((item: any) => ({
          datetime: item.datetime,
          aqi: Math.round(item.predicted_aqi),
          status: item.category,
          health_advice: item.health_advice?.general || item.health_advice,
          parameters: item.parameters,
          temporal_info: item.temporal_info,
        })) || [],
      status: data.status,
      timestamp: data.timestamp,
      period: data.data?.period,
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching hourly forecast:", error);

    // Return fallback data
    return NextResponse.json(
      {
        error: "ML API not available",
        fallback: true,
        forecast: [],
        message: "Hourly forecast temporarily unavailable",
      },
      { status: 200 }
    );
  }
}
