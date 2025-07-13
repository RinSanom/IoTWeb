export interface WeatherResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    surface_pressure: number[];
    visibility: number[];
  };
}

// Air Quality Interface matching server
export interface AQIData {
  id: number;
  pm2_5?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  co?: number;
  so2?: number;
  nh3?: number;
  pb?: number;
  timestamp: Date | string;
  level?: string;
}

export interface CreateAQIRequest {
  pm2_5?: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  co?: number;
  so2?: number;
  nh3?: number;
  pb?: number;
}

export interface AQILevel {
  name: string;
  range: string;
  color: string;
  description: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  level?: string;
}