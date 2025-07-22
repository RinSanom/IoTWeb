"use client";

import { useState, useEffect } from 'react';
import { Bell, BellOff, Settings, AlertTriangle, Info } from 'lucide-react';
import { useNotificationService } from '@/hooks/useNotificationService';

interface NotificationSettingsProps {
  className?: string;
}

export default function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  const { notificationService, isInitialized, isSupported, isClient } = useNotificationService();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [threshold, setThreshold] = useState(100);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (isClient && notificationService) {
      checkNotificationStatus();
      loadUserPreferences();
    }
  }, [isClient, notificationService, isInitialized]);

  const checkNotificationStatus = async () => {
    if (notificationService?.isNotificationSupported()) {
      setPermission(notificationService.getPermissionStatus());
      const subscribed = await notificationService.getSubscriptionStatus();
      setIsSubscribed(subscribed);
      setIsEnabled(permission === 'granted' && subscribed);
    }
  };

  const loadUserPreferences = () => {
    const savedThreshold = localStorage.getItem('air-quality-threshold');
    if (savedThreshold) {
      setThreshold(parseInt(savedThreshold, 10));
    }
    
    const savedEnabled = localStorage.getItem('air-quality-notifications-enabled');
    if (savedEnabled) {
      setIsEnabled(JSON.parse(savedEnabled));
    }
  };

  const saveUserPreferences = (newThreshold: number, enabled: boolean) => {
    localStorage.setItem('air-quality-threshold', newThreshold.toString());
    localStorage.setItem('air-quality-notifications-enabled', JSON.stringify(enabled));
  };

  const handleEnableNotifications = async () => {
    if (!notificationService) {
      alert('Notification service not available');
      return;
    }

    setIsLoading(true);
    try {
      await notificationService.initialize();
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        setIsSubscribed(true);
        setIsEnabled(true);
        saveUserPreferences(threshold, true);
        
        // Show test notification
        await notificationService.showLocalNotification(
          'Notifications Enabled! ',
          {
            body: 'You will now receive air quality alerts when levels exceed your threshold.',
            tag: 'notification-enabled'
          }
        );
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      alert('Failed to enable notifications. Please check your browser settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    if (!notificationService) {
      return;
    }

    setIsLoading(true);
    try {
      await notificationService.unsubscribe();
      setIsSubscribed(false);
      setIsEnabled(false);
      saveUserPreferences(threshold, false);
    } catch (error) {
      console.error('Failed to disable notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThresholdChange = (newThreshold: number) => {
    setThreshold(newThreshold);
    saveUserPreferences(newThreshold, isEnabled);
  };

  const testNotification = async () => {
    if (permission === 'granted' && notificationService) {
      await notificationService.showLocalNotification(
        'Test Notification 🧪',
        {
          body: `This is how air quality alerts will look. Current threshold: AQI ${threshold}`,
          tag: 'test-notification'
        }
      );
    }
  };

  const getThresholdInfo = (value: number) => {
    if (value <= 50) return { level: 'Good', color: 'text-green-600', bg: 'bg-green-50' };
    if (value <= 100) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (value <= 150) return { level: 'Unhealthy for Sensitive', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (value <= 200) return { level: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-50' };
    return { level: 'Very Unhealthy', color: 'text-purple-600', bg: 'bg-purple-50' };
  };

  const thresholdInfo = getThresholdInfo(threshold);

  if (!isClient || !notificationService || !notificationService.isNotificationSupported()) {
    return (
      <div className={`p-4 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-3 text-gray-600">
          <BellOff className="h-5 w-5" />
          <span>Push notifications are not supported in this browser.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
      </div>

      {/* Permission Status */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {permission === 'granted' ? (
              <Bell className="h-5 w-5 text-green-600" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            <span className="font-medium">Air Quality Alerts</span>
          </div>
          
          {!isEnabled ? (
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Enabling...' : 'Enable Notifications'}
            </button>
          ) : (
            <button
              onClick={handleDisableNotifications}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Disabling...' : 'Disable'}
            </button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          {permission === 'granted' && isEnabled ? (
            <div className="flex items-center gap-2 text-green-600">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              Notifications are enabled and active
            </div>
          ) : permission === 'denied' ? (
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Notifications are blocked. Please enable them in your browser settings.
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <Info className="h-4 w-4" />
              Enable notifications to receive air quality alerts
            </div>
          )}
        </div>
      </div>

      {/* Threshold Settings */}
      {isEnabled && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Threshold (AQI)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={threshold}
                onChange={(e) => handleThresholdChange(parseInt(e.target.value, 10))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${thresholdInfo.bg} ${thresholdInfo.color}`}>
                {threshold}
              </div>
            </div>
          </div>

          <div className={`p-3 rounded-lg ${thresholdInfo.bg}`}>
            <div className={`text-sm ${thresholdInfo.color}`}>
              <strong>Alert Level:</strong> {thresholdInfo.level}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              You'll receive notifications when air quality exceeds AQI {threshold}
            </div>
          </div>
        </div>
      )}

      {/* Test Notification */}
      {isEnabled && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Test Notification</h4>
              <p className="text-sm text-gray-600">Send a test notification to verify it's working</p>
            </div>
            <button
              onClick={testNotification}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Send Test
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="space-y-1 text-xs">
              <li>• Notifications are checked every 10 minutes</li>
              <li>• You'll only get alerts when AQI exceeds your threshold</li>
              <li>• Works even when the app is closed (if supported by your device)</li>
              <li>• You can adjust the threshold anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
