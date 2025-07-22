"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Bell,
  Settings,
  ArrowLeft,
  Check,
  Bug,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

// Dynamic imports to avoid SSR issues with localStorage/navigator APIs
const NotificationSettingsClient = dynamic(
  () => import("@/components/ui/notification-settings-client"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
    ),
  }
);

const NotificationDebuggerClient = dynamic(
  () => import("@/components/ui/notification-debugger-client"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
    ),
  }
);

const AlertSettingsClient = dynamic(
  () => import("@/components/air-quality/AlertSettingsClient"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
    ),
  }
);

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState("alerts");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [showSaved, setShowSaved] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedAutoRefresh = localStorage.getItem("autoRefresh");
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedLocationServices = localStorage.getItem("locationServices");

    if (savedAutoRefresh !== null) {
      setAutoRefresh(JSON.parse(savedAutoRefresh));
    }
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
      // Apply dark mode on load
      if (JSON.parse(savedDarkMode)) {
        document.documentElement.classList.add("dark");
      }
    }
    if (savedLocationServices !== null) {
      setLocationServices(JSON.parse(savedLocationServices));
    }
  }, []);

  const showSavedIndicator = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // Handle auto-refresh toggle
  const handleAutoRefreshToggle = () => {
    const newValue = !autoRefresh;
    setAutoRefresh(newValue);
    localStorage.setItem("autoRefresh", JSON.stringify(newValue));
    showSavedIndicator();

    console.log("Auto-refresh:", newValue ? "enabled" : "disabled");
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("darkMode", JSON.stringify(newValue));

    // Apply dark mode to document
    if (newValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    showSavedIndicator();
    console.log("Dark mode:", newValue ? "enabled" : "disabled");
  };

  // Handle location services toggle
  const handleLocationServicesToggle = () => {
    const newValue = !locationServices;
    setLocationServices(newValue);
    localStorage.setItem("locationServices", JSON.stringify(newValue));
    showSavedIndicator();

    if (newValue) {
      // Request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Location enabled:", {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (error) => {
            console.error("Location error:", error);
            // Revert if permission denied
            if (error.code === error.PERMISSION_DENIED) {
              setLocationServices(false);
              localStorage.setItem("locationServices", JSON.stringify(false));
              alert(
                "Location permission denied. Please enable in browser settings."
              );
            }
          }
        );
      }
    } else {
      console.log("Location services disabled");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Settings
                </h1>
              </div>
            </div>

            {/* Save Indicator */}
            <div
              className={`transition-all duration-300 ${
                showSaved ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                <Check className="w-4 h-4" />
                <span>Settings Saved</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("alerts")}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "alerts"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alert Settings
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "notifications"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "general"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab("debug")}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "debug"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Bug className="w-4 h-4 mr-2" />
              Debug
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          {activeTab === "alerts" && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Alert Thresholds
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Set up automatic alerts when air quality reaches certain levels.
              </p>
              <AlertSettingsClient />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Push Notifications
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Configure how and when you receive push notifications.
              </p>
              <NotificationSettingsClient />
            </div>
          )}

          {activeTab === "general" && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                General Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Configure app behavior and preferences.
              </p>

              <div className="space-y-6">
                {/* Auto Refresh */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Auto Refresh
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically refresh air quality data every 30 seconds
                    </p>
                  </div>
                  <button
                    onClick={handleAutoRefreshToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      autoRefresh
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoRefresh ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Dark Mode
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable dark theme for better nighttime viewing
                    </p>
                  </div>
                  <button
                    onClick={handleDarkModeToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      darkMode ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Location Services */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Location Services
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow location access for local air quality data
                    </p>
                  </div>
                  <button
                    onClick={handleLocationServicesToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      locationServices
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        locationServices ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "debug" && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Debug Information
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Technical information for troubleshooting notifications and app
                behavior.
              </p>
              <NotificationDebuggerClient />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
