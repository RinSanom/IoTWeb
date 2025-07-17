"use client";

import { useState, useEffect } from 'react';

interface PWABannerSpacerProps {
  children: React.ReactNode;
}

export default function PWABannerSpacer({ children }: PWABannerSpacerProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed === 'true') return;

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      setTimeout(() => {
        setShowBanner(true);
      }, 2000);
    };

    const handleAppInstalled = () => {
      setShowBanner(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return (
    <div className={showBanner ? 'pt-12 sm:pt-16' : ''}>
      {children}
    </div>
  );
}
