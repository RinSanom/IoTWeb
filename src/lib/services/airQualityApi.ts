import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AirQualityData {
  aqi?: number;
  aqi_category: string;
  status?: string;
  location?: string;
  pm10: number;
  pm2_5: number;
  pm1_0?: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  nh3: number;
  pb: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  particles_0_3um?: number;
  particles_0_5um?: number;
  particles_1_0um?: number;
  particles_2_5um?: number;
  particles_5_0um?: number;
  particles_10um?: number;
  pm2_5_uncertainty?: number;
  sensor_status?: string;
  quality_level?: number;
  quality_description?: string;
  timestamp: string;
  lastUpdated?: string;
  system_status?: any;
}

export interface AirQualityResponse {
  data: AirQualityData[];
  latest?: AirQualityData;
}

export const airQualityApi = createApi({
  reducerPath: "airQualityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["AirQuality"],
  endpoints: (builder) => ({
    getAirQualityData: builder.query<AirQualityData[], void>({
      query: () => "/air-quality",
      providesTags: ["AirQuality"],
    }),
    getLatestAirQuality: builder.query<AirQualityData, void>({
      query: () => "/air-quality/latest",
      providesTags: ["AirQuality"],
    }),
  }),
});

export const { useGetAirQualityDataQuery, useGetLatestAirQualityQuery } =
  airQualityApi;
