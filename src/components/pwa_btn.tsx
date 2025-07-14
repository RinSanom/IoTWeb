'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [installMessage, setInstallMessage] = useState('');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  
  // State to track if the component has mounted
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Check if window is defined (i.e., client-side execution)
    setIsClient(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    if (!isClient) return; // Avoid running on the server-side

    const handler = (e: BeforeInstallPromptEvent) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    // For testing - show banner after 3 seconds if no prompt available
    const timeout = setTimeout(() => {
      if (!deferredPrompt) {
        console.log('PWA: No install prompt available, showing manual instructions');
        setShowInstall(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
      clearTimeout(timeout);
    };
  }, [isClient]);

  const handleInstallClick = async () => {
    setIsInstalling(true);
    setInstallMessage('Preparing installation...');

    if (!deferredPrompt) {
      // Try alternative installation methods for different browsers
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Try to trigger browser's native install without alerts
      try {
        if (userAgent.includes('chrome') || userAgent.includes('edge')) {
          setInstallMessage('Look for install icon (⬇️) in address bar');
          setTimeout(() => setInstallMessage(''), 4000);
        } else if (userAgent.includes('safari')) {
          setInstallMessage('Tap Share (↗️) → Add to Home Screen');
          setTimeout(() => setInstallMessage(''), 6000);
        } else if (userAgent.includes('firefox')) {
          setInstallMessage('Check browser menu → Install App');
          setTimeout(() => setInstallMessage(''), 4000);
        } else {
          setInstallMessage('Check browser menu for "Install" option');
          setTimeout(() => setInstallMessage(''), 4000);
        }
      } catch (error) {
        console.error('Alternative install failed:', error);
        setInstallMessage('Installation not available in this browser');
        setTimeout(() => setInstallMessage(''), 3000);
      }
      
      setIsInstalling(false);
      return;
    }

    try {
      setInstallMessage('Installing app...');
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ PWA installed successfully!');
        setInstallMessage('✅ App installed successfully!');
        setInstallSuccess(true);
        setTimeout(() => {
          setShowInstall(false);
        }, 2000);
      } else {
        console.log('❌ User declined PWA installation');
        setInstallMessage('Installation cancelled by user');
        setTimeout(() => setInstallMessage(''), 3000);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA install error:', error);
      setInstallMessage('Installation failed - try again later');
      setTimeout(() => setInstallMessage(''), 3000);
    } finally {
      setIsInstalling(false);
    }
  };

  if (!showInstall && !deferredPrompt) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${installSuccess ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white p-4 shadow-lg transition-colors duration-500`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{installSuccess ? '✅' : '📱'}</span>
          <div>
            <p className="font-semibold text-sm">
              {installSuccess ? 'App Installed!' : 'Install this app on your device'}
            </p>
            <p className="text-xs opacity-90">
              {installMessage || (installSuccess ? 'You can now use the app from your home screen' : "Get the full app experience with offline access")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!installSuccess && (
            <button 
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInstalling ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Installing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {deferredPrompt ? 'Install Now' : 'Get App'}
                </>
              )}
            </button>
          )}
          <button
            onClick={() => setShowInstall(false)}
            className="text-white/80 hover:text-white p-1 text-lg w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
