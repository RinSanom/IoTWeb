"use client";

import { useEffect, useState } from 'react';

interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  showBanner: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  showManualInstructions: boolean;
  isDesktop: boolean;
}

export function usePWAInstall() {
  const [state, setState] = useState<PWAInstallState>({
    canInstall: false,
    isInstalled: false,
    showBanner: false,
    installPrompt: null,
    showManualInstructions: false,
    isDesktop: false,
  });

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    setState(prev => ({ ...prev, isDesktop }));

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setState(prev => ({ ...prev, isInstalled: isStandalone }));

    if (isStandalone) return; // Don't set up listeners if already installed

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: Install prompt available');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      const installEvent = e as BeforeInstallPromptEvent;
      setState(prev => ({
        ...prev,
        canInstall: true,
        installPrompt: installEvent,
        showBanner: true,
      }));

      // Auto-hide banner after delay on mobile
      if (!isDesktop) {
        setTimeout(() => {
          setState(prev => ({ ...prev, showBanner: false }));
        }, 10000); // Hide after 10 seconds on mobile
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA: App installed');
      setState(prev => ({
        ...prev,
        canInstall: false,
        isInstalled: true,
        showBanner: false,
        installPrompt: null,
      }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show fallback banner after 3 seconds if no install prompt
    const fallbackTimer = setTimeout(() => {
      setState(prev => {
        if (!prev.installPrompt && !prev.isInstalled) {
          console.log('PWA: No install prompt available, showing manual instructions');
          return {
            ...prev,
            showBanner: true,
            canInstall: true, // Show banner even without prompt
          };
        }
        return prev;
      });
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const installApp = async () => {
    if (state.installPrompt) {
      // Native install prompt available
      try {
        await state.installPrompt.prompt();
        const { outcome } = await state.installPrompt.userChoice;
        console.log(`PWA Install: ${outcome}`);
        setState(prev => ({
          ...prev,
          canInstall: false,
          showBanner: false,
          installPrompt: null,
        }));
        return outcome === 'accepted';
      } catch (error) {
        console.error('PWA Install error:', error);
        return false;
      }
    } else {
      // No native prompt available, do nothing (no manual instructions)
      return false;
    }
  };

  const dismissBanner = () => {
    setState(prev => ({ ...prev, showBanner: false }));
    // Store in session to prevent showing again
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const dismissManualInstructions = () => {
    setState(prev => ({ ...prev, showManualInstructions: false }));
  };

  return {
    ...state,
    installApp,
    dismissBanner,
    dismissManualInstructions,
  };
}

export default function PWAInstallPrompt() {
  const { canInstall, isInstalled, installApp, dismissBanner, installPrompt, showManualInstructions, dismissManualInstructions, isDesktop } = usePWAInstall();

  // Don't show anything if installed or can't install
  if (isInstalled || !canInstall) {
    return null;
  }

  // Check if user already dismissed this session
  if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-banner-dismissed')) {
    return null;
  }

  const hasNativePrompt = !!installPrompt;

  const bannerContent = (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Animated Icon */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-2">
              <svg className="w-6 h-6 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm sm:text-base flex items-center gap-2">
              🚀 Install Air Monitor PWA
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs bg-white/20 rounded-full">
                FREE
              </span>
            </div>
            <div className="text-xs sm:text-sm opacity-90">
              {hasNativePrompt 
                ? "⚡ One-click install • Offline access • Native experience" 
                : "📱 Available for installation • Works offline • Fast & reliable"
              }
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={installApp}
            className="group relative bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl overflow-hidden"
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l-3-3" />
            </svg>
            <span className="relative z-10">
              {hasNativePrompt ? "Install Now" : "Get App"}
            </span>
          </button>
          
          <button
            onClick={dismissBanner}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {isDesktop ? (
        <div className="fixed bottom-5 right-5 z-50">
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white shadow-2xl animate-slide-in-right rounded-lg p-4 max-w-md">
            {bannerContent}
          </div>
        </div>
      ) : (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white shadow-2xl animate-slide-down">
          <div className="container mx-auto px-4 py-3">
            {bannerContent}
          </div>
          <div className="h-1 bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 animate-pulse"></div>
        </div>
      )}
      {/* Manual Instructions Modal removed for automatic install only */}
    </>
  );
}
