import { NextRequest, NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const aqi = searchParams.get("aqi") || "85";

    const response = await fetch(`${ML_API_BASE}/api/health-advice/${aqi}`, {
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
    console.error("Error fetching health advice:", error);

    // Return fallback health advice
    const aqi = parseInt(new URL(request.url).searchParams.get("aqi") || "85");
    let advice = "Air quality information temporarily unavailable.";

    if (aqi <= 50) {
      advice = "Air quality is good. Enjoy outdoor activities!";
    } else if (aqi <= 100) {
      advice =
        "Air quality is moderate. Sensitive individuals should consider reducing prolonged outdoor exertion.";
    } else if (aqi <= 150) {
      advice =
        "Air quality is unhealthy for sensitive groups. Reduce outdoor activities if you experience symptoms.";
    } else {
      advice =
        "Air quality is unhealthy. Everyone should limit outdoor activities.";
    }

    return NextResponse.json(
      {
        error: "ML API not available",
        fallback: true,
        aqi,
        health_advice: advice,
      },
      { status: 200 }
    );
  }
}
