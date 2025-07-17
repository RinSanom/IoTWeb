"use client";

import React, { useEffect, useState } from 'react';

interface PWAStatus {
  serviceWorkerSupported: boolean;
  serviceWorkerRegistered: boolean;
  manifestSupported: boolean;
  manifestLoaded: boolean;
  isStandalone: boolean;
  beforeInstallPromptFired: boolean;
  installPromptAvailable: boolean;
  notificationPermission: string;
  errors: string[];
}

const PWADebugPanel: React.FC = () => {
  const [status, setStatus] = useState<PWAStatus>({
    serviceWorkerSupported: false,
    serviceWorkerRegistered: false,
    manifestSupported: false,
    manifestLoaded: false,
    isStandalone: false,
    beforeInstallPromptFired: false,
    installPromptAvailable: false,
    notificationPermission: 'default',
    errors: []
  });

  useEffect(() => {
    const checkPWAStatus = async () => {
      const newStatus: PWAStatus = {
        serviceWorkerSupported: 'serviceWorker' in navigator,
        serviceWorkerRegistered: false,
        manifestSupported: 'serviceWorker' in navigator,
        manifestLoaded: false,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true,
        beforeInstallPromptFired: false,
        installPromptAvailable: false,
        notificationPermission: Notification.permission,
        errors: []
      };

      // Check Service Worker Registration
      if (newStatus.serviceWorkerSupported) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          newStatus.serviceWorkerRegistered = !!registration;
        } catch (error) {
          newStatus.errors.push(`Service Worker: ${error}`);
        }
      }

      // Check Manifest
      try {
        const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
        if (manifestLink) {
          const response = await fetch(manifestLink.href);
          if (response.ok) {
            const manifest = await response.json();
            newStatus.manifestLoaded = !!manifest.name;
          } else {
            newStatus.errors.push(`Manifest fetch failed: ${response.status}`);
          }
        } else {
          newStatus.errors.push('No manifest link found');
        }
      } catch (error) {
        newStatus.errors.push(`Manifest: ${error}`);
      }

      setStatus(newStatus);
    };

    checkPWAStatus();

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      setStatus(prev => ({
        ...prev,
        beforeInstallPromptFired: true,
        installPromptAvailable: true
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const testServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration);
      setStatus(prev => ({ ...prev, serviceWorkerRegistered: true }));
    } catch (error) {
      console.error('SW registration failed:', error);
      setStatus(prev => ({ 
        ...prev, 
        errors: [...prev.errors, `SW Registration: ${error}`]
      }));
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setStatus(prev => ({ ...prev, notificationPermission: permission }));
    } catch (error) {
      console.error('Notification permission failed:', error);
    }
  };

  const StatusIndicator = ({ status, label }: { status: boolean; label: string }) => (
    <div className="flex items-center gap-2 p-2 rounded">
      <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className={status ? 'text-green-700' : 'text-red-700'}>{label}</span>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-bold mb-2">PWA Debug Panel</h3>
      
      <div className="space-y-1 text-sm">
        <StatusIndicator status={status.serviceWorkerSupported} label="Service Worker Support" />
        <StatusIndicator status={status.serviceWorkerRegistered} label="Service Worker Registered" />
        <StatusIndicator status={status.manifestSupported} label="Manifest Support" />
        <StatusIndicator status={status.manifestLoaded} label="Manifest Loaded" />
        <StatusIndicator status={status.isStandalone} label="Running as PWA" />
        <StatusIndicator status={status.beforeInstallPromptFired} label="Install Prompt Available" />
        
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <strong>Notification Permission:</strong> {status.notificationPermission}
        </div>
        
        {status.errors.length > 0 && (
          <div className="mt-2 p-2 bg-red-50 rounded">
            <strong className="text-red-700">Errors:</strong>
            <ul className="mt-1 text-xs text-red-600">
              {status.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-3 space-y-2">
          <button 
            onClick={testServiceWorker}
            className="w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
          >
            Test Service Worker
          </button>
          <button 
            onClick={requestNotificationPermission}
            className="w-full bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
          >
            Request Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWADebugPanel;
