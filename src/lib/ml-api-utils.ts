// ML API utilities for air quality predictions
export const ML_API_BASE = process.env.ML_API_URL || "http://localhost:5000";

export interface MLPredictionRequest {
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
}

export interface MLPredictionResponse {
  predicted_aqi: number;
  status: string;
  confidence: number;
  health_advice: string;
  method: string;
  color?: string;
  input_parameters?: any;
  timestamp: string;
  api_status: string;
  note?: string;
}

export async function callMLAPI(data: MLPredictionRequest): Promise<MLPredictionResponse> {
  const response = await fetch(`${ML_API_BASE}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(10000), // 10 second timeout
  });

  if (!response.ok) {
    throw new Error(`ML API responded with status: ${response.status}`);
  }

  return await response.json();
}
