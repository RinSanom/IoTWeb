"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PWADebugger() {
  const [pwaStatus, setPwaStatus] = useState({
    isInstallable: false,
    isInstalled: false,
    serviceWorkerStatus: 'unknown',
    cacheStatus: 'unknown',
    networkStatus: navigator.onLine ? 'online' : 'offline',
  });

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;

    // Check service worker
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          return registration ? 'active' : 'not-registered';
        } catch (error) {
          return 'error';
        }
      }
      return 'not-supported';
    };

    // Check cache
    const checkCache = async () => {
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          return cacheNames.length > 0 ? `${cacheNames.length} caches` : 'no-caches';
        } catch (error) {
          return 'error';
        }
      }
      return 'not-supported';
    };

    const updateStatus = async () => {
      const swStatus = await checkServiceWorker();
      const cacheStatus = await checkCache();
      
      setPwaStatus(prev => ({
        ...prev,
        isInstalled: isStandalone,
        serviceWorkerStatus: swStatus,
        cacheStatus: cacheStatus,
      }));
    };

    updateStatus();

    // Listen for install prompt
    const handleBeforeInstallPrompt = () => {
      setPwaStatus(prev => ({ ...prev, isInstallable: true }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setPwaStatus(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
    };

    // Listen for online/offline
    const handleOnline = () => {
      setPwaStatus(prev => ({ ...prev, networkStatus: 'online' }));
    };

    const handleOffline = () => {
      setPwaStatus(prev => ({ ...prev, networkStatus: 'offline' }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusColor = (status: string) => {
    if (status.includes('active') || status.includes('online') || status === 'true') return 'text-green-600';
    if (status.includes('error') || status.includes('offline')) return 'text-red-600';
    if (status.includes('not-') || status === 'false') return 'text-orange-600';
    return 'text-blue-600';
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">PWA Debug Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Installable:</span>
            <span className={getStatusColor(pwaStatus.isInstallable.toString())}>
              {pwaStatus.isInstallable ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Installed:</span>
            <span className={getStatusColor(pwaStatus.isInstalled.toString())}>
              {pwaStatus.isInstalled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Service Worker:</span>
            <span className={getStatusColor(pwaStatus.serviceWorkerStatus)}>
              {pwaStatus.serviceWorkerStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Cache:</span>
            <span className={getStatusColor(pwaStatus.cacheStatus)}>
              {pwaStatus.cacheStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Network:</span>
            <span className={getStatusColor(pwaStatus.networkStatus)}>
              {pwaStatus.networkStatus}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="text-xs text-gray-500">
              Build: {process.env.NODE_ENV}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
