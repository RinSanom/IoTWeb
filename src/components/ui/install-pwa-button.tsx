"use client";

import { useState, useEffect } from 'react';
import { PWAInstallModal } from '../PWAInstallModal';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'ios' | 'android' | 'other'>('other');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isDesktop = !isIOS && !isAndroid;

    if (isIOS) {
      setDeviceType('ios');
    } else if (isAndroid) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    setIsInstalled(isStandalone);

    if (isStandalone) return;

    // Always show install button for all platforms
    setCanInstall(true);

    // For Android and Desktop, use beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setInstallPrompt(e);
      setCanInstall(true);
      console.log('PWA: Install prompt available');
    };

    const handleAppInstalled = () => {
      setCanInstall(false);
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log('PWA: App installed');
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    setIsLoading(true);

    // If native prompt is available, use it
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('PWA: User accepted the install prompt');
        } else {
          console.log('PWA: User dismissed the install prompt');
        }

        setInstallPrompt(null);
        setCanInstall(false);
      } catch (error) {
        console.error('PWA: Install error:', error);
        // Fallback to modal if native prompt fails
        setShowModal(true);
      }
    } else {
      // Show beautiful modal with platform-specific instructions
      setShowModal(true);
    }

    setIsLoading(false);
  };

  if (isInstalled || !canInstall) {
    return null;
  }

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      );
    }

    const icon = deviceType === 'ios' ? (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18a6 6 0 006-6h-4.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H3.75a1 1 0 00-1 1v10a1 1 0 001 1h12.5a1 1 0 001-1v-4.5M12 18v-4.5m0 0l3 3m-3-3l-3 3" />
      </svg>
    );

    const text = deviceType === 'ios' ? 'Get App' : 'Install App';

    return (
      <>
        {icon}
        <span className="hidden sm:inline">{text}</span>
        <span className="sm:hidden">Install</span>
      </>
    );
  };

  return (
    <>
      <button
        onClick={handleInstall}
        disabled={isLoading}
        className="relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed group"
      >
        <div className="relative z-10 flex items-center gap-2">
          {getButtonContent()}
        </div>
      </button>

      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        deviceType={deviceType === 'other' ? 'desktop' : deviceType}
      />
    </>
  );
}
