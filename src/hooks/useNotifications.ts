import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/lib/services/notificationService';

interface UseNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  enableNotifications: () => Promise<boolean>;
  disableNotifications: () => Promise<void>;
  testNotification: () => Promise<void>;
  checkAirQualityAndNotify: (aqi: number, data?: any) => Promise<void>;
  getSubscriptionStatus: () => Promise<boolean>;
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if notifications are supported
  const isSupported = notificationService.isNotificationSupported();

  // Initialize and check status
  useEffect(() => {
    const initializeNotifications = async () => {
      if (isSupported) {
        try {
          await notificationService.initialize();
          setPermission(notificationService.getPermissionStatus());
          const subscribed = await notificationService.getSubscriptionStatus();
          setIsSubscribed(subscribed);
        } catch (error) {
          console.error('Failed to initialize notifications:', error);
        }
      }
    };

    initializeNotifications();
  }, [isSupported]);

  // Enable notifications
  const enableNotifications = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    setIsLoading(true);
    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        setIsSubscribed(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Disable notifications
  const disableNotifications = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await notificationService.unsubscribe();
      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to disable notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Test notification
  const testNotification = useCallback(async (): Promise<void> => {
    if (permission !== 'granted') return;

    try {
      await notificationService.showLocalNotification(
        'Test Notification ',
        {
          body: 'This is how air quality alerts will appear.',
          tag: 'test-notification'
        }
      );
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  }, [permission]);

  // Check air quality and send notification if needed
  const checkAirQualityAndNotify = useCallback(async (aqi: number, data?: any): Promise<void> => {
    if (!isSubscribed || permission !== 'granted') return;

    try {
      await notificationService.checkAirQualityAndNotify(aqi, data);
    } catch (error) {
      console.error('Failed to check air quality for notifications:', error);
    }
  }, [isSubscribed, permission]);

  // Get current subscription status
  const getSubscriptionStatus = useCallback(async (): Promise<boolean> => {
    try {
      return await notificationService.getSubscriptionStatus();
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return false;
    }
  }, []);

  return {
    permission,
    isSupported,
    isSubscribed,
    isLoading,
    enableNotifications,
    disableNotifications,
    testNotification,
    checkAirQualityAndNotify,
    getSubscriptionStatus
  };
}
