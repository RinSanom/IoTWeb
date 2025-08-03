import { NextRequest, NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const response = await fetch(`${ML_API_BASE}/api/parameters`, {
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
    console.error("Error fetching parameters:", error);

    return NextResponse.json(
      {
        error: "ML API not available",
        fallback: true,
        parameters: {
          temperature: { unit: "°C", description: "Air temperature" },
          humidity: { unit: "%", description: "Relative humidity" },
          pm25: { unit: "μg/m³", description: "Fine particulate matter" },
          pm10: { unit: "μg/m³", description: "Coarse particulate matter" },
          o3: { unit: "μg/m³", description: "Ozone" },
          no2: { unit: "μg/m³", description: "Nitrogen dioxide" },
        },
        message: "Parameter information temporarily unavailable",
      },
      { status: 200 }
    );
  }
}
