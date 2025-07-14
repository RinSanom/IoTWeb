"use client";

import { useEffect } from 'react';

// Extend Window interface for workbox
declare global {
  interface Window {
    workbox?: {
      addEventListener: (event: string, handler: () => void) => void;
      register: () => void;
    };
  }
}

export default function PWAInstaller() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      
      // Add event listeners to handle PWA lifecycle
      const handleControlling = () => {
        console.log('PWA: Service worker is controlling the page');
      };

      const handleWaiting = () => {
        console.log('PWA: Service worker is waiting');
      };

      const handleInstalled = () => {
        console.log('PWA: Service worker installed');
      };

      wb.addEventListener('controlling', handleControlling);
      wb.addEventListener('waiting', handleWaiting);
      wb.addEventListener('installed', handleInstalled);

      // Register the service worker
      wb.register();
    }

    // Handle PWA installation prompt
    const handleBeforeInstallPrompt = () => {
      console.log('PWA: Install prompt available');
    };

    const handleAppInstalled = () => {
      console.log('PWA: App was installed successfully');
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return null;
}
