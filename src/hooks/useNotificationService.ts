"use client";

import { useEffect, useState } from 'react';
import { notificationService } from '@/lib/services/notificationService';

export function useNotificationService() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check if notifications are supported
      setIsSupported(notificationService.isNotificationSupported());
      
      // Initialize the service
      notificationService.initialize()
        .then(() => {
          setIsInitialized(true);
        })
        .catch((error) => {
          console.error('Failed to initialize notification service:', error);
          setIsInitialized(false);
        });
    }
  }, []);

  return {
    notificationService: typeof window !== 'undefined' ? notificationService : null,
    isInitialized,
    isSupported,
    isClient: typeof window !== 'undefined'
  };
}
