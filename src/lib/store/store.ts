import { configureStore } from '@reduxjs/toolkit';
import { weatherApi } from '../services/weatherApi';
import { airQualityApi } from '../services/airQualityApi';
import { authApi } from '../services/authApi';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [airQualityApi.reducerPath]: airQualityApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      weatherApi.middleware,
      airQualityApi.middleware,
      authApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

