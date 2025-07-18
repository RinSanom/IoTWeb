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
    
    // Check if running on iOS
    const isIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Check if running in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && 
      ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches);

    if (typeof window === 'undefined') {
      console.log('PWA Installer: Window not available (SSR)');
      return;
    }

    // Show iOS-specific install prompt
    if (isIOS() && !isInStandaloneMode()) {
      console.log('PWA Installer: iOS device detected, showing install instructions');
      // You can show a custom iOS install prompt here
      const showIOSInstallPrompt = () => {
        // Show your custom iOS install prompt component
        const prompt = document.createElement('div');
        prompt.innerHTML = `
          <div class="ios-prompt" style="
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
          ">
            <img src="/icons/icon-72x72.png" style="width: 30px; height: 30px;" alt="Air Monitor icon">
            <div>
              <div style="font-weight: bold; margin-bottom: 5px;">Install Air Monitor</div>
              <div style="font-size: 14px;">Tap <img src="/icons/share-icon.png" style="width: 20px; vertical-align: middle;"> and then "Add to Home Screen"</div>
            </div>
            <button onclick="this.parentElement.remove()" style="
              margin-left: 10px;
              padding: 5px 10px;
              border: none;
              background: #eee;
              border-radius: 5px;
              cursor: pointer;
            ">Close</button>
          </div>
        `;
        document.body.appendChild(prompt);
      };
      
      // Show the prompt after a short delay
      setTimeout(showIOSInstallPrompt, 2000);
    }

    if (!('serviceWorker' in navigator)) {
      console.log('PWA Installer: Service Worker not supported');
      return;
    }

    // Register service worker
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
                // Show update notification
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Update Available', {
                    body: 'A new version of Air Monitor is available. Refresh to update.',
                    icon: '/icons/icon-192x192.png'
                  });
                }
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
