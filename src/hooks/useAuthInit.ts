"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { fetchUserProfile } from '@/lib/store/authSlice';

export const useAuthInit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // If we have a token but no user data, fetch the user profile
    if (accessToken && !user && isAuthenticated) {
      dispatch(fetchUserProfile(accessToken));
    }
  }, [accessToken, user, isAuthenticated, dispatch]);
};
