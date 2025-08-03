// Utility functions for ML API health advice

export interface HealthAdviceResponse {
  aqi: number;
  health_advice: string;
  fallback?: boolean;
  error?: string;
}

/**
 * Fetch health advice for a specific AQI value
 * @param aqi - Air Quality Index value (0-500)
 * @returns Promise with health advice data
 */
export async function getHealthAdvice(
  aqi: number
): Promise<HealthAdviceResponse> {
  try {
    const response = await fetch(`/api/ml-predictions/health-advice/${aqi}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching health advice:", error);

    // Return fallback data
    return {
      aqi,
      health_advice: getFallbackHealthAdvice(aqi),
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get fallback health advice when ML API is not available
 * @param aqi - Air Quality Index value
 * @returns Health advice string
 */
export function getFallbackHealthAdvice(aqi: number): string {
  if (aqi <= 50) {
    return "Air quality is good. Enjoy outdoor activities!";
  } else if (aqi <= 100) {
    return "Air quality is moderate. Sensitive individuals should consider reducing prolonged outdoor exertion.";
  } else if (aqi <= 150) {
    return "Air quality is unhealthy for sensitive groups. Reduce outdoor activities if you experience symptoms.";
  } else if (aqi <= 200) {
    return "Air quality is unhealthy. Everyone should limit outdoor activities.";
  } else if (aqi <= 300) {
    return "Air quality is very unhealthy. Avoid outdoor activities.";
  } else {
    return "Air quality is hazardous. Stay indoors and keep windows closed.";
  }
}

/**
 * Get AQI status category
 * @param aqi - Air Quality Index value
 * @returns Status string
 */
export function getAQIStatus(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

/**
 * Get AQI color class for UI styling
 * @param aqi - Air Quality Index value
 * @returns CSS color class string
 */
export function getAQIColorClass(aqi: number): string {
  if (aqi <= 50) return "text-green-600 bg-green-50 border-green-200";
  if (aqi <= 100) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  if (aqi <= 150) return "text-orange-600 bg-orange-50 border-orange-200";
  if (aqi <= 200) return "text-red-600 bg-red-50 border-red-200";
  if (aqi <= 300) return "text-purple-600 bg-purple-50 border-purple-200";
  return "text-red-800 bg-red-100 border-red-300";
}

/**
 * Get hex color for charts
 * @param aqi - Air Quality Index value
 * @returns Hex color string
 */
export function getAQIHexColor(aqi: number): string {
  if (aqi <= 50) return "#10b981"; // green
  if (aqi <= 100) return "#f59e0b"; // yellow
  if (aqi <= 150) return "#f97316"; // orange
  if (aqi <= 200) return "#ef4444"; // red
  if (aqi <= 300) return "#a855f7"; // purple
  return "#7f1d1d"; // dark red
}

// Usage examples:
/*
// Basic usage
const advice = await getHealthAdvice(85);
console.log(advice.health_advice);

// Use in React component
const [healthData, setHealthData] = useState(null);

useEffect(() => {
  getHealthAdvice(currentAQI).then(setHealthData);
}, [currentAQI]);

// Direct API call
fetch('/api/ml-predictions/health-advice/85')
  .then(res => res.json())
  .then(data => console.log(data.health_advice));
*/
