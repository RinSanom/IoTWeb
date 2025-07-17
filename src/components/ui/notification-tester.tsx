"use client";

import { useState } from 'react';
import { Bell, TestTube, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationTester() {
  const [status, setStatus] = useState<string>('');
  const {
    permission,
    isSupported,
    isSubscribed,
    enableNotifications,
    testNotification,
    checkAirQualityAndNotify,
  } = useNotifications();

  const handleEnableNotifications = async () => {
    setStatus('Requesting permission...');
    const success = await enableNotifications();
    if (success) {
      setStatus('✅ Notifications enabled successfully!');
      setTimeout(() => setStatus(''), 3000);
    } else {
      setStatus('❌ Failed to enable notifications');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleTestNotification = async () => {
    setStatus('Sending test notification...');
    try {
      await testNotification();
      setStatus('✅ Test notification sent!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('❌ Failed to send test notification');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleTestHighAQI = async () => {
    setStatus('Triggering high AQI alert...');
    try {
      await checkAirQualityAndNotify(150, {
        location: 'Test Location',
        timestamp: Date.now(),
        pollutants: { pm25: 55, pm10: 150, no2: 40 }
      });
      setStatus('✅ High AQI alert triggered!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('❌ Failed to trigger AQI alert');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleTestCriticalAQI = async () => {
    setStatus('Triggering critical AQI alert...');
    try {
      await checkAirQualityAndNotify(250, {
        location: 'Test Location',
        timestamp: Date.now(),
        pollutants: { pm25: 150, pm10: 250, no2: 80 }
      });
      setStatus('✅ Critical AQI alert triggered!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('❌ Failed to trigger critical alert');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-700">
          ❌ Notifications are not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TestTube className="h-5 w-5 text-blue-600" />
        Notification Tester
      </h3>

      {/* Status Display */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Status:</span>
          <span className={`ml-2 ${
            permission === 'granted' ? 'text-green-600' : 
            permission === 'denied' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {permission === 'granted' ? '✅ Enabled' : 
             permission === 'denied' ? '❌ Blocked' : '⏳ Not Set'}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Subscribed:</span>
          <span className={`ml-2 ${isSubscribed ? 'text-green-600' : 'text-gray-500'}`}>
            {isSubscribed ? '✅ Yes' : '❌ No'}
          </span>
        </div>
        {status && (
          <div className="text-sm p-2 bg-blue-50 border border-blue-200 rounded text-blue-700">
            {status}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Enable Notifications */}
        {permission !== 'granted' && (
          <button
            onClick={handleEnableNotifications}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Bell className="h-4 w-4" />
            Enable Notifications
          </button>
        )}

        {/* Test Basic Notification */}
        {permission === 'granted' && (
          <button
            onClick={handleTestNotification}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            Test Basic Alert
          </button>
        )}

        {/* Test High AQI */}
        {permission === 'granted' && (
          <button
            onClick={handleTestHighAQI}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            Test High AQI (150)
          </button>
        )}

        {/* Test Critical AQI */}
        {permission === 'granted' && (
          <button
            onClick={handleTestCriticalAQI}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            Test Critical AQI (250)
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <p className="font-medium mb-1">📱 How to get notifications:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click "Enable Notifications" above</li>
          <li>Allow notifications when prompted by your browser</li>
          <li>Test with the buttons above</li>
          <li>Set your AQI threshold in Settings (default: 100)</li>
          <li>Automatic alerts will trigger when AQI exceeds your threshold</li>
        </ol>
      </div>
    </div>
  );
}
