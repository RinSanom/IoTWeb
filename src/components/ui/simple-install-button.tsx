"use client";

import { useState, useEffect } from 'react';
import { Download, Check, Smartphone } from 'lucide-react';
import { notificationService } from '@/lib/services/notificationService';

interface SimpleInstallButtonProps {
  variant?: 'default' | 'floating';
  className?: string;
  text?: string;
}

export default function SimpleInstallButton({ 
  variant = 'default', 
  className = '',
  text = 'Install App'
}: SimpleInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    setIsInstalled(isStandalone);

    if (isStandalone) {
      setShowButton(false);
      return;
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setIsInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    console.log('Install button clicked');
    
    if (isInstalled) {
      alert('App is already installed!');
      return;
    }

    if (!deferredPrompt) {
      // Show manual install instructions
      showManualInstructions();
      return;
    }

    setIsInstalling(true);

    try {
      console.log('Showing install prompt...');
      await deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User choice:', outcome);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowButton(false);
        showSuccessMessage();
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install failed:', error);
      showManualInstructions();
    } finally {
      setIsInstalling(false);
    }
  };

  const showSuccessMessage = async () => {
    // Initialize notification service after PWA installation
    try {
      await notificationService.initialize();
      alert('App installed successfully! 🎉\n\nWould you like to enable air quality notifications? You can set this up in the app settings.');
    } catch (error) {
      console.error('Error initializing notifications:', error);
      alert('App installed successfully! 🎉');
    }
  };

  const showManualInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    
    if (isIOS) {
      alert('To install on iOS:\n1. Tap the Share button (⬆️)\n2. Select "Add to Home Screen"\n3. Tap "Add"');
    } else if (isChrome) {
      alert('To install on Chrome:\n1. Look for the install icon (⊞) in the address bar\n2. Or use Chrome menu → "Add to Home screen"\n3. Click "Install"');
    } else {
      alert('To install:\n1. Use your browser menu\n2. Look for "Add to Home Screen" or "Install"\n3. Follow the prompts');
    }
  };

  // Don't show if installed
  if (isInstalled) {
    return null;
  }

  const baseClasses = "transition-all duration-200 font-medium flex items-center gap-2 cursor-pointer";

  if (variant === 'floating') {
    return (
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`
          fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white 
          rounded-full shadow-lg hover:shadow-xl active:scale-95 z-50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${baseClasses}
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
        px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
        shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 
        disabled:cursor-not-allowed
        ${baseClasses}
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
