import { NextRequest, NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const response = await fetch(`${ML_API_BASE}/api/data/metadata`, {
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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching metadata:", error);

    return NextResponse.json(
      {
        error: "ML API not available",
        fallback: true,
        api: "AQI Machine Learning API",
        description:
          "Complete Air Quality Index prediction and monitoring system",
        model_accuracy: "99.95%",
        status: "offline",
        version: "1.0",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
