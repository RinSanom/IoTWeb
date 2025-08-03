import { NextRequest, NextResponse } from "next/server";

const ML_API_BASE = process.env.ML_API_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  let body: any = {};
  
  try {
    body = await request.json();
    
    // Try to connect to ML API
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

    // Return a fallback prediction if ML API is unavailable
    const fallbackAQI = estimateAQI(body);

    return NextResponse.json({
      predicted_aqi: fallbackAQI,
      status: getAQIStatus(fallbackAQI),
      confidence: 0.7, // Lower confidence for fallback
      health_advice: getHealthAdvice(fallbackAQI),
      method: "Fallback Estimation",
      color: getAQIColor(fallbackAQI),
      input_parameters: body,
      timestamp: new Date().toISOString(),
      api_status: "fallback",
      note: "ML service temporarily unavailable. Using fallback estimation."
    });
  }
}

// Fallback estimation functions
function estimateAQI(params: any): number {
  // Simple estimation based on input parameters
  let aqi = 50; // Default moderate value
  
  if (params.temperature) {
    // High temperature can correlate with higher pollution
    if (params.temperature > 30) aqi += 10;
    if (params.temperature > 35) aqi += 15;
  }
  
  if (params.humidity) {
    // Very low or high humidity can affect air quality
    if (params.humidity < 30 || params.humidity > 80) aqi += 5;
  }
  
  if (params.wind_speed) {
    // Higher wind speed generally improves air quality
    if (params.wind_speed > 10) aqi -= 10;
    if (params.wind_speed < 5) aqi += 15;
  }
  
  // Keep within reasonable bounds
  return Math.max(20, Math.min(150, aqi));
}

function getAQIStatus(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function getHealthAdvice(aqi: number): string {
  if (aqi <= 50) return "Air quality is good. Enjoy outdoor activities!";
  if (aqi <= 100) return "Air quality is acceptable. Sensitive individuals should consider limiting outdoor exertion.";
  if (aqi <= 150) return "Sensitive individuals should reduce outdoor exertion and avoid prolonged outdoor activities.";
  if (aqi <= 200) return "Everyone should limit outdoor exertion and avoid prolonged outdoor activities.";
  if (aqi <= 300) return "Everyone should avoid outdoor exertion. Stay indoors and keep windows closed.";
  return "Health warnings of emergency conditions. Everyone should stay indoors.";
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "#00e400";
  if (aqi <= 100) return "#ffff00";
  if (aqi <= 150) return "#ff7e00";
  if (aqi <= 200) return "#ff0000";
  if (aqi <= 300) return "#8f3f97";
  return "#7e0023";
}
