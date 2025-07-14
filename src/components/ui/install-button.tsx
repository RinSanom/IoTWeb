"use client";

import { useState, useEffect } from 'react';
import { Button } from './button';

export default function InstallButton() {
  const [showToast, setShowToast] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [browserName, setBrowserName] = useState('');

  useEffect(() => {
    // Check if app is already installed (running in standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Detect mobile device
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);

    // Detect browser
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      setBrowserName('Chrome');
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      setBrowserName('Safari');
    } else if (userAgent.includes('Firefox')) {
      setBrowserName('Firefox');
    } else if (userAgent.includes('Edg')) {
      setBrowserName('Edge');
    } else {
      setBrowserName('Browser');
    }

    // Show toast notification for mobile users (not already installed)
    if (!standalone && mobile) {
      // Delay to show after page loads
      const timer = setTimeout(() => {
        setShowToast(true);
        // Auto hide after 8 seconds for more time to read
        setTimeout(() => setShowToast(false), 8000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const getInstallInstructions = () => {
    if (browserName === 'Chrome') {
      return 'Tap the menu (⋮) → "Add to Home screen"';
    } else if (browserName === 'Safari') {
      return 'Tap Share (□↗) → "Add to Home Screen"';
    } else if (browserName === 'Firefox') {
      return 'Tap menu (⋮) → "Install"';
    } else {
      return 'Use browser menu → "Add to Home Screen"';
    }
  };

  // Don't show anything if app is already installed
  if (isStandalone) {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>App Installed ✅</span>
      </div>
    );
  }

  // Show regular button (not for install, just regular action)
  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="border-primary text-primary hover:bg-primary hover:text-white dark:border-primary dark:text-primary dark:bg-gray-800/50 dark:hover:bg-primary dark:hover:text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto"
        onClick={() => {
          // Just a regular action, not install
          window.open('/air-quality', '_self');
        }}
      >
        Explore Air Quality
      </Button>

      {/* Enhanced Toast notification for mobile - Top Left */}
      {showToast && (
        <div className="fixed top-4 left-4 z-50 md:hidden max-w-xs">
          <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-3 rounded-lg shadow-lg animate-slide-down">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">📱</span>
                  <span className="text-xs font-semibold truncate">Install Air Monitor</span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {getInstallInstructions()}
                </p>
                {isMobile && (
                  <div className="mt-1 text-xs opacity-75">
                    Quick home screen access!
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-white/80 hover:text-white flex-shrink-0 p-0.5"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
