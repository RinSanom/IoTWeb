import { NextRequest, NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${ML_API_BASE}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`ML API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform the nested ML API response to expected format
    const transformedData = {
      predicted_aqi: Math.round(
        data.data?.predicted_aqi || data.predicted_aqi || 0
      ),
      status: data.data?.category || data.status || "Unknown",
      confidence: 0.95, // Default confidence since ML API doesn't provide this
      health_advice:
        data.data?.health_advice?.general ||
        data.data?.health_advice ||
        data.health_advice ||
        "Health advice not available",
      method: data.data?.method || "ML Prediction",
      color: data.data?.color,
      input_parameters: data.data?.input_parameters,
      timestamp: data.data?.timestamp || new Date().toISOString(),
      api_status: data.status,
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error making ML prediction:", error);

    return NextResponse.json(
      {
        error: "Failed to get ML prediction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
