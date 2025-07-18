// Service for handling real sensor data from your IoT API

export interface SensorData {
  co_ppm: number;
  h2s_ppm: number;
  ch4_ppm: number;
  o2_percent: number;
}

export interface SensorReading {
  timestamp: string;
  sensor_id: string;
  sensor_type: string;
  data: SensorData;
  status: string;
  quality_level: number;
  quality_description: string;
}

export interface SensorApiResponse {
  status: {
    system_status: string;
    timestamp: string;
    client_id: string;
    active_sensors: number;
    readings_this_cycle: number;
    uptime_cycles: number;
  };
  [key: string]: any; // For dynamic sensor keys like ZCE04B_ttyUSB0
  alerts?: {
    sensor_id: string;
    alert_type: string;
    message: string;
    severity: string;
    timestamp: string;
  };
}

export interface AirQualityData {
  aqi_category: string;
  pm10: number;
  pm2_5: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  nh3: number;
  pb: number;
  timestamp: string;
}

class SensorDataService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_AIR_QUALITY_API || '';
  }

  // Function to calculate AQI category based on quality level
  getAQICategory(qualityLevel: number): string {
    switch (qualityLevel) {
      case 1:
        return "Good";
      case 2:
        return "Moderate";
      case 3:
        return "Unhealthy for Sensitive Groups";
      case 4:
        return "Unhealthy";
      case 5:
        return "Very Unhealthy";
      case 6:
        return "Hazardous";
      default:
        return "Unknown";
    }
  }

  // Convert gas readings to air quality equivalent values
  convertGasToAirQuality(sensorData: SensorData) {
    // Convert ppm values to approximate air quality measurements
    const co_mg_m3 = sensorData.co_ppm * 1.165; // CO conversion from ppm to mg/m³
    const h2s_ug_m3 = sensorData.h2s_ppm * 1400; // H2S conversion from ppm to µg/m³
    
    return {
      pm10: Math.min(Math.max(co_mg_m3 * 8, 10), 500),
      pm2_5: Math.min(Math.max(h2s_ug_m3 / 80, 5), 300),
      no2: Math.min(Math.max(sensorData.h2s_ppm * 6, 10), 200),
      o3: Math.min(Math.max((21 - sensorData.o2_percent) * 50 + 80, 50), 300),
      co: co_mg_m3,
      so2: Math.min(Math.max(sensorData.h2s_ppm * 1.5, 5), 100),
      nh3: Math.min(Math.max(sensorData.ch4_ppm * 0.8, 1), 50),
      pb: 0.1, // Default low value for lead
    };
  }

  // Get quality color based on category
  getQualityColor(category: string): string {
    switch (category.toUpperCase()) {
      case 'GOOD':
        return 'green';
      case 'MODERATE':
        return 'yellow';
      case 'UNHEALTHY FOR SENSITIVE GROUPS':
        return 'orange';
      case 'UNHEALTHY':
        return 'red';
      case 'VERY UNHEALTHY':
        return 'purple';
      case 'HAZARDOUS':
        return 'maroon';
      default:
        return 'gray';
    }
  }

  // Fetch latest sensor data
  async fetchLatestSensorData(): Promise<SensorApiResponse> {
    if (!this.baseUrl) {
      throw new Error('API URL not configured');
    }

    const response = await fetch(`${this.baseUrl}/api/latest`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return response.json();
  }

  // Transform sensor data to air quality format
  transformSensorToAirQuality(data: SensorApiResponse): AirQualityData | null {
    // Find the sensor data (excluding status and alerts)
    const sensorKeys = Object.keys(data).filter(key => 
      key !== 'status' && key !== 'alerts' && typeof data[key] === 'object'
    );

    if (sensorKeys.length === 0) {
      return null;
    }

    // Use the first sensor's data
    const sensorKey = sensorKeys[0];
    const sensorReading: SensorReading = data[sensorKey];
    
    if (!sensorReading || !sensorReading.data) {
      return null;
    }

    // Convert sensor data to air quality format
    const airQualityValues = this.convertGasToAirQuality(sensorReading.data);
    
    return {
      aqi_category: sensorReading.quality_description || this.getAQICategory(sensorReading.quality_level),
      pm10: Math.round(airQualityValues.pm10 * 100) / 100,
      pm2_5: Math.round(airQualityValues.pm2_5 * 100) / 100,
      no2: Math.round(airQualityValues.no2 * 100) / 100,
      o3: Math.round(airQualityValues.o3 * 100) / 100,
      co: Math.round(airQualityValues.co * 100) / 100,
      so2: Math.round(airQualityValues.so2 * 100) / 100,
      nh3: Math.round(airQualityValues.nh3 * 100) / 100,
      pb: airQualityValues.pb,
      timestamp: sensorReading.timestamp,
    };
  }

  // Get health recommendation based on quality level
  getHealthRecommendation(qualityLevel: number): string {
    switch (qualityLevel) {
      case 1:
        return "Air quality is good. Ideal for outdoor activities.";
      case 2:
        return "Air quality is acceptable. Sensitive individuals should consider limiting prolonged outdoor exposure.";
      case 3:
        return "Unhealthy for sensitive groups. Children, elderly, and people with respiratory conditions should limit outdoor activities.";
      case 4:
        return "Unhealthy air quality. Everyone should limit outdoor activities and consider wearing masks.";
      case 5:
        return "Very unhealthy air quality. Avoid outdoor activities. Stay indoors with air purification if possible.";
      case 6:
        return "Hazardous air quality. Emergency conditions. Everyone should avoid outdoor activities.";
      default:
        return "Air quality data unavailable. Exercise caution.";
    }
  }
}

export const sensorDataService = new SensorDataService();
