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

export interface AirQualityResponse {
  data: AirQualityData[];
  latest?: AirQualityData;
}

export const airQualityApi = createApi({
  reducerPath: 'airQualityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['AirQuality'],
  endpoints: (builder) => ({
    getAirQualityData: builder.query<AirQualityData[], void>({
      query: () => '/air-quality',
      providesTags: ['AirQuality'],
    }),
    getLatestAirQuality: builder.query<AirQualityData, void>({
      query: () => '/air-quality/latest',
      providesTags: ['AirQuality'],
    }),
  }),
});

export const { 
  useGetAirQualityDataQuery, 
  useGetLatestAirQualityQuery 
} = airQualityApi;
