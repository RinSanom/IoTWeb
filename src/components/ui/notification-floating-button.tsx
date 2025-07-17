"use client";

import { useState, useEffect } from 'react';
import { Bell, BellRing, Settings2, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAirQuality } from '@/contexts/AirQualityContext';

export default function NotificationFloatingButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const {
    permission,
    isSupported,
    isSubscribed,
    isLoading,
    enableNotifications,
    testNotification
  } = useNotifications();
  const { data } = useAirQuality();

  useEffect(() => {
    // Auto-show quick setup if notifications aren't enabled and AQI is high
    if (isSupported && permission !== 'granted' && data.aqi > 100) {
      const hasShownSetup = localStorage.getItem('notification-setup-shown');
      if (!hasShownSetup) {
        setShowQuickSetup(true);
        localStorage.setItem('notification-setup-shown', 'true');
      }
    }
  }, [isSupported, permission, data.aqi]);

  const handleQuickEnable = async () => {
    const success = await enableNotifications();
    if (success) {
      setShowQuickSetup(false);
      setIsExpanded(true);
      setTimeout(() => {
        testNotification();
      }, 1000);
    }
  };

  if (!isSupported) return null;

  return (
    <>
      {/* Quick Setup Popup */}
      {showQuickSetup && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in slide-in-from-bottom-4 sm:slide-in-from-scale-95">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <BellRing className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Air Quality Alert!</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Current AQI is {data.aqi}. Enable notifications to stay informed about air quality changes.
                </p>
              </div>
              <button
                onClick={() => setShowQuickSetup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleQuickEnable}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? 'Enabling...' : 'Enable Notifications'}
              </button>
              <button
                onClick={() => setShowQuickSetup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className={`transition-all duration-300 ${isExpanded ? 'space-y-3' : ''}`}>
          {/* Expanded Options */}
          {isExpanded && (
            <div className="space-y-2 animate-in slide-in-from-bottom-2">
              <button
                onClick={testNotification}
                disabled={permission !== 'granted'}
                className="flex items-center gap-2 bg-white shadow-lg hover:shadow-xl px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BellRing className="h-4 w-4 text-blue-600" />
                Test Alert
              </button>
              
              <a
                href="/settings"
                className="flex items-center gap-2 bg-white shadow-lg hover:shadow-xl px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <Settings2 className="h-4 w-4 text-gray-600" />
                Settings
              </a>
            </div>
          )}

          {/* Main Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
              isSubscribed && permission === 'granted'
                ? 'bg-green-600 text-white'
                : permission === 'denied'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
            title={
              isSubscribed && permission === 'granted'
                ? 'Notifications Active'
                : permission === 'denied'
                ? 'Notifications Blocked'
                : 'Enable Notifications'
            }
          >
            <Bell className="h-6 w-6" />
            
            {/* Status Indicator */}
            <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
              isSubscribed && permission === 'granted'
                ? 'bg-green-400'
                : permission === 'denied'
                ? 'bg-red-400'
                : 'bg-yellow-400'
            }`} />
            
            {/* Pulse Animation for Active Notifications */}
            {isSubscribed && permission === 'granted' && (
              <div className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-25" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
