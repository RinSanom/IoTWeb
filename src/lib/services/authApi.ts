import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/lib/types/auth';

const baseUrl = process.env.NEXT_PUBLIC_AIR_QUALITY_API || 'http://127.0.0.1:8000';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/register/',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query<User, void>({
      query: () => '/profile/',
      providesTags: ['User'],
    }),
    refreshToken: builder.mutation<{ access: string }, { refresh: string }>({
      query: (refreshData) => ({
        url: '/token/refresh/',
        method: 'POST',
        body: refreshData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
} = authApi;
