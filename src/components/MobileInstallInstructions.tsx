"use client";

import { useState, useEffect } from 'react';

export function MobileInstallInstructions() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Show instructions for iOS users (since they don't get beforeinstallprompt)
    if (iOS && !standalone) {
      const hasSeenInstructions = sessionStorage.getItem('ios-install-instructions-seen');
      if (!hasSeenInstructions) {
        setTimeout(() => setShowInstructions(true), 3000);
      }
    }

    // Listen for manual instruction trigger
    const handleShowInstructions = () => {
      if (!standalone) {
        setShowInstructions(true);
      }
    };

    window.addEventListener('show-mobile-instructions', handleShowInstructions);

    return () => {
      window.removeEventListener('show-mobile-instructions', handleShowInstructions);
    };
  }, []);

  const dismissInstructions = () => {
    setShowInstructions(false);
    sessionStorage.setItem('ios-install-instructions-seen', 'true');
  };

  if (isStandalone || !showInstructions) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <div className="text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Install Air Monitor PWA
          </h3>
          
          {isIOS ? (
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
              <p>To install this PWA on your iPhone:</p>
              <div className="flex items-center gap-2 text-left">
                <span className="text-blue-500">1.</span>
                <span>Tap the Share button</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </div>
              <div className="flex items-center gap-2 text-left">
                <span className="text-blue-500">2.</span>
                <span>Select &quot;Add to Home Screen&quot;</span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <span className="text-blue-500">3.</span>
                <span>The app will work like a native app</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>Use the &quot;Install PWA&quot; button in your browser or the header to install the app for offline access and native app experience.</p>
            </div>
          )}
          
          <button
            onClick={dismissInstructions}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
