"use client";

import { useState } from 'react';
import { notificationService } from '@/lib/services/notificationService';
import { Bell, TestTube, Bug, CheckCircle, XCircle } from 'lucide-react';

export default function NotificationDebugger() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runBasicTest = async () => {
    setIsLoading(true);
    addTestResult('🧪 Starting basic notification test...');
    
    try {
      // Check browser support
      if (!('Notification' in window)) {
        addTestResult('❌ Notifications not supported in this browser');
        return;
      }
      addTestResult('✅ Browser supports notifications');

      // Check current permission
      const permission = Notification.permission;
      addTestResult(`📋 Current permission: ${permission}`);

      // Request permission if needed
      if (permission === 'default') {
        addTestResult('🔐 Requesting notification permission...');
        const newPermission = await notificationService.requestPermission();
        addTestResult(`📋 New permission: ${newPermission}`);
      }

      // Try to send a simple notification
      if (Notification.permission === 'granted') {
        addTestResult('📤 Sending test notification...');
        await notificationService.showLocalNotification(
          'Test Notification',
          {
            body: 'If you see this, notifications are working!',
            tag: 'debug-test',
            requireInteraction: false
          }
        );
        addTestResult('✅ Test notification sent successfully');
      } else {
        addTestResult('❌ Cannot send notification - permission not granted');
      }

    } catch (error) {
      addTestResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runAirQualityTest = async () => {
    setIsLoading(true);
    addTestResult('🌬️ Testing air quality notification...');
    
    try {
      // Enable notifications for test
      localStorage.setItem('air-quality-notifications-enabled', 'true');
      localStorage.setItem('air-quality-threshold', '100');
      addTestResult('✅ Enabled notifications for test');

      // Clear cooldown
      localStorage.removeItem('last-notification-time');
      addTestResult('✅ Cleared notification cooldown');

      // Test with high AQI
      await notificationService.triggerTestAlert(150);
      addTestResult('📤 Triggered test alert with AQI 150');

    } catch (error) {
      addTestResult(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeService = async () => {
    setIsLoading(true);
    addTestResult('🔄 Initializing notification service...');
    
    try {
      await notificationService.initialize();
      addTestResult('✅ Service initialized successfully');
    } catch (error) {
      addTestResult(`❌ Service initialization failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runFullTest = async () => {
    setIsLoading(true);
    clearResults();
    
    try {
      await notificationService.testNotification();
      addTestResult('✅ Full test completed - check browser console for details');
    } catch (error) {
      addTestResult(`❌ Full test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bug className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Notification Debugger</h2>
      </div>

      <div className="space-y-4 mb-6">
        <button
          onClick={runBasicTest}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 justify-center"
        >
          <TestTube className="h-4 w-4" />
          Run Basic Test
        </button>

        <button
          onClick={initializeService}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 justify-center"
        >
          <CheckCircle className="h-4 w-4" />
          Initialize Service
        </button>

        <button
          onClick={runAirQualityTest}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 justify-center"
        >
          <Bell className="h-4 w-4" />
          Test Air Quality Alert
        </button>

        <button
          onClick={runFullTest}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 justify-center"
        >
          <Bug className="h-4 w-4" />
          Run Full Diagnostic
        </button>

        <button
          onClick={clearResults}
          className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 justify-center"
        >
          <XCircle className="h-4 w-4" />
          Clear Results
        </button>
      </div>

      {/* Test Results */}
      <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-3">Test Results:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500 italic">No tests run yet. Click a button above to start testing.</p>
        ) : (
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Quick Info:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Browser permission: {Notification.permission}</li>
          <li>• Notifications supported: {'Notification' in window ? 'Yes' : 'No'}</li>
          <li>• ServiceWorker supported: {'serviceWorker' in navigator ? 'Yes' : 'No'}</li>
          <li>• Current threshold: {localStorage.getItem('air-quality-threshold') || 'Not set'}</li>
          <li>• Notifications enabled: {localStorage.getItem('air-quality-notifications-enabled') || 'Not set'}</li>
        </ul>
      </div>
    </div>
  );
}
