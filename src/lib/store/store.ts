import { configureStore } from '@reduxjs/toolkit';
import { weatherApi } from '../services/weatherApi';
import { airQualityApi } from '../services/airQualityApi';

export const store = configureStore({
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer,
    [airQualityApi.reducerPath]: airQualityApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      weatherApi.middleware,
      airQualityApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

