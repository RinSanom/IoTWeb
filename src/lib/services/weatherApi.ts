
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WeatherResponse } from '../types';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_WEATHER_API,
  }),
  endpoints: (builder) => ({
    getWeather: builder.query<WeatherResponse, { latitude: number; longitude: number }>({
      query: ({ latitude, longitude }) =>
        `forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,visibility&timezone=auto`,
    }),
  }),
});

export const { useGetWeatherQuery } = weatherApi;
