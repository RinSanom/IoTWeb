export interface WeatherResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
}