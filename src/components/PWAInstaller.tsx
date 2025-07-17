"use client";

import { useEffect } from 'react';

// Extend Window interface for workbox and BeforeInstallPromptEvent
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
    console.log('PWA Installer: Initializing...');
    
    // Check if service worker is supported
    if (typeof window === 'undefined') {
      console.log('PWA Installer: Window not available (SSR)');
      return;
    }

    if (!('serviceWorker' in navigator)) {
      console.log('PWA Installer: Service Worker not supported');
      return;
    }

    // Register service worker manually as fallback
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        
        console.log('PWA: Service Worker registered successfully', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('PWA: New version available!');
                // You could show a notification here
              }
            });
          }
        });
        
      } catch (error) {
        console.error('PWA: Service Worker registration failed:', error);
      }
    };

    // Check if workbox is available, otherwise register manually
    if (window.workbox) {
      console.log('PWA: Using Workbox');
      const wb = window.workbox;
      
      // Add event listeners to handle PWA lifecycle
      const handleControlling = () => {
        console.log('PWA: Service worker is controlling the page');
        window.location.reload();
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
    } else {
      console.log('PWA: Workbox not available, registering service worker manually');
      registerServiceWorker();
    }

    // Handle PWA installation prompt
    let deferredPrompt: any = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: Install prompt triggered');
      e.preventDefault();
      deferredPrompt = e as any;
      
      // Show install button or banner
      const installButton = document.querySelector('[data-pwa-install]');
      if (installButton) {
        installButton.classList.remove('hidden');
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA: App was installed successfully');
      deferredPrompt = null;
      
      // Hide install button
      const installButton = document.querySelector('[data-pwa-install]');
      if (installButton) {
        installButton.classList.add('hidden');
      }
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      console.log('PWA: App is running in standalone mode');
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return null;
}
