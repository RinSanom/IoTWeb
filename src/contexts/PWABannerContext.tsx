"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PWABannerContextType {
  isBannerVisible: boolean;
  setBannerVisible: (visible: boolean) => void;
  bannerHeight: number;
}

const PWABannerContext = createContext<PWABannerContextType | undefined>(undefined);

export function PWABannerProvider({ children }: { children: React.ReactNode }) {
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(48); // Default banner height

  const setBannerVisible = (visible: boolean) => {
    setIsBannerVisible(visible);
    
    // Update CSS custom property for header positioning
    if (visible) {
      document.documentElement.style.setProperty('--pwa-banner-height', `${bannerHeight}px`);
    } else {
      document.documentElement.style.removeProperty('--pwa-banner-height');
    }
  };

  useEffect(() => {
    // Update banner height based on screen size
    const updateBannerHeight = () => {
      const height = window.innerWidth >= 640 ? 56 : 48;
      setBannerHeight(height);
      
      if (isBannerVisible) {
        document.documentElement.style.setProperty('--pwa-banner-height', `${height}px`);
      }
    };

    updateBannerHeight();
    window.addEventListener('resize', updateBannerHeight);
    
    return () => {
      window.removeEventListener('resize', updateBannerHeight);
    };
  }, [isBannerVisible]);

  return (
    <PWABannerContext.Provider value={{ isBannerVisible, setBannerVisible, bannerHeight }}>
      {children}
    </PWABannerContext.Provider>
  );
}

export function usePWABanner() {
  const context = useContext(PWABannerContext);
  if (context === undefined) {
    throw new Error('usePWABanner must be used within a PWABannerProvider');
  }
  return context;
}
