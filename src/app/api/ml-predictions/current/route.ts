import { NextRequest, NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const response = await fetch(`${ML_API_BASE}/api/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`ML API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching current ML data:", error);

    // Return fallback data if ML API is not available
    return NextResponse.json(
      {
        error: "ML API not available",
        fallback: true,
        aqi: 85,
        status: "Moderate",
        health_advice:
          "Sensitive individuals should consider reducing prolonged outdoor exertion.",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
