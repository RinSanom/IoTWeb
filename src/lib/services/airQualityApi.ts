import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
  [key: string]: any; // For dynamic sensor keys
  alerts?: {
    sensor_id: string;
    alert_type: string;
    message: string;
    severity: string;
    timestamp: string;
  };
}

export interface AirQualityResponse {
  data: AirQualityData[];
  latest?: AirQualityData;
}

export const airQualityApi = createApi({
  reducerPath: 'airQualityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['AirQuality', 'SensorData'],
  endpoints: (builder) => ({
    getAirQualityData: builder.query<AirQualityData[], void>({
      query: () => '/air-quality',
      providesTags: ['AirQuality'],
    }),
    getLatestAirQuality: builder.query<AirQualityData, void>({
      query: () => '/air-quality/latest',
      providesTags: ['AirQuality'],
    }),
    getRealTimeSensorData: builder.query<SensorApiResponse, void>({
      query: () => '/air-quality/realtime',
      providesTags: ['SensorData'],
    }),
  }),
});

export const { 
  useGetAirQualityDataQuery, 
  useGetLatestAirQualityQuery,
  useGetRealTimeSensorDataQuery
} = airQualityApi;
