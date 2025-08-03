import { NextRequest, NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const response = await fetch(`${ML_API_BASE}/api/locations`, {
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
    console.error("Error fetching locations:", error);

    return NextResponse.json(
      {
        error: "ML API not available",
        fallback: true,
        locations: ["Phnom Penh, Cambodia"],
        message: "Location data temporarily unavailable",
      },
      { status: 200 }
    );
  }
}
