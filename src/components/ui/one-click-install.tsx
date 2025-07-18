"use client";

import { useState, useEffect } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import PWAInstallHelper from '@/lib/pwa-install-helper';

interface OneClickInstallProps {
  variant?: 'default' | 'minimal' | 'floating';
  className?: string;
  text?: string;
}

export default function OneClickInstall({ 
  variant = 'default', 
  className = '',
  text = 'Install App'
}: OneClickInstallProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Initialize PWA helper
    PWAInstallHelper.init();
    
    // Check installation status
    const checkStatus = () => {
      setIsInstalled(PWAInstallHelper.getIsInstalled());
      setCanInstall(PWAInstallHelper.canInstall());
    };

    checkStatus();

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setIsInstalling(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Periodically check if install prompt is available
    const interval = setInterval(checkStatus, 1000);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(interval);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await PWAInstallHelper.install();
      if (success) {
        setIsInstalled(true);
        setCanInstall(false);
      }
    } catch (error) {
      console.error('Install error:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    if (variant === 'minimal') {
      return (
        <div className={`p-2 rounded-lg bg-green-500 text-white ${className}`} title="App Installed">
          <Check className="h-5 w-5" />
        </div>
      );
    }
    return null;
  }

  // Show install button even if canInstall is false (for fallback instructions)
  const baseButtonClasses = "transition-all duration-200 flex items-center gap-2 font-medium";
  
  if (variant === 'minimal') {
    return (
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`
          p-2 rounded-lg bg-primary text-white hover:bg-primary/90 
          disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-95
          ${baseButtonClasses}
          ${className}
        `}
        title={text}
      >
        {isInstalling ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Download className="h-5 w-5" />
        )}
      </button>
    );
  }

  if (variant === 'floating') {
    return (
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`
          fixed bottom-[170px] right-6 p-4 bg-primary text-white rounded-full shadow-lg 
          hover:shadow-xl hover:bg-primary/90 active:scale-95 z-40
          ${baseButtonClasses}
          ${className}
        `}
        title={text}
      >
        {isInstalling ? (
          <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Smartphone className="h-6 w-6" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isInstalling}
      className={`
        px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white 
        rounded-lg hover:from-primary/90 hover:to-primary shadow-lg 
        hover:shadow-xl disabled:opacity-50 active:scale-95
        ${baseButtonClasses}
        ${className}
      `}
    >
      {isInstalling ? (
        <>
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          <span>Installing...</span>
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          <span>{text}</span>
        </>
      )}
    </button>
  );
}
