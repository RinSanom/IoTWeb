"use client";

import { useState, useEffect } from 'react';
import NotificationSettings from '@/components/ui/notification-settings';
import NotificationDebugger from '@/components/ui/notification-debugger';
import { Bell, Settings, ArrowLeft, Check, Bug } from 'lucide-react';
import Link from 'next/link';

export default function NotificationSettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [showSaved, setShowSaved] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedAutoRefresh = localStorage.getItem('autoRefresh');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLocationServices = localStorage.getItem('locationServices');

    if (savedAutoRefresh !== null) {
      setAutoRefresh(JSON.parse(savedAutoRefresh));
    }
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedLocationServices !== null) {
      setLocationServices(JSON.parse(savedLocationServices));
    }

    // Check current dark mode state
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  // Show saved indicator temporarily
  const showSavedIndicator = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // Handle auto-refresh toggle
  const handleAutoRefreshToggle = () => {
    const newValue = !autoRefresh;
    setAutoRefresh(newValue);
    localStorage.setItem('autoRefresh', JSON.stringify(newValue));
    showSavedIndicator();
    
    // You can add logic here to actually start/stop auto-refresh
    console.log('Auto-refresh:', newValue ? 'enabled' : 'disabled');
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
    
    // Apply dark mode to document
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    showSavedIndicator();
    console.log('Dark mode:', newValue ? 'enabled' : 'disabled');
  };

  // Handle location services toggle
  const handleLocationServicesToggle = () => {
    const newValue = !locationServices;
    setLocationServices(newValue);
    localStorage.setItem('locationServices', JSON.stringify(newValue));
    showSavedIndicator();
    
    if (newValue) {
      // Request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Location enabled:', position.coords);
          },
          (error) => {
            console.error('Location error:', error);
            // Revert if permission denied
            if (error.code === error.PERMISSION_DENIED) {
              setLocationServices(false);
              localStorage.setItem('locationServices', JSON.stringify(false));
              alert('Location permission denied. Please enable in browser settings.');
            }
          }
        );
      }
    } else {
      console.log('Location services disabled');
    }
  };

  return (
    <div className="mt-[100px] bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/" 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">App Settings</h1>
              <p className="text-gray-600">Manage your air quality monitoring preferences</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </div>
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
                activeTab === 'general'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                General
              </div>
            </button>
            {/* <button
              onClick={() => setActiveTab('debug')}
              className={`px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
                activeTab === 'debug'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Debug
              </div>
            </button> */}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 relative">
          {/* Saved Indicator */}
          {showSaved && (
            <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center gap-2 z-10 animate-in fade-in duration-200">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Settings saved!</span>
            </div>
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings />
          )}

          {/* {activeTab === 'debug' && (
            <NotificationDebugger />
          )} */}
          
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Auto-refresh Data</h4>
                      <p className="text-sm text-gray-600">Automatically update air quality data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={autoRefresh}
                        onChange={handleAutoRefreshToggle}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Dark Mode</h4>
                      <p className="text-sm text-gray-600">Enable dark theme for the app</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={darkMode}
                        onChange={handleDarkModeToggle}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Location Services</h4>
                      <p className="text-sm text-gray-600">Use your location for more accurate readings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={locationServices}
                        onChange={handleLocationServicesToggle}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Air Pollution Monitor</strong> v1.0.0
                  </p>
                  <p className="text-sm text-gray-600">
                    Real-time air quality monitoring with push notifications to keep you informed about environmental conditions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
