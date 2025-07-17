"use client";

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWABanner } from '@/contexts/PWABannerContext';

export default function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const { setBannerVisible } = usePWABanner();

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    setIsInstalled(isStandalone);

    if (isStandalone) return;

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed === 'true') return;

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show banner after a small delay
      setTimeout(() => {
        setShowBanner(true);
        setBannerVisible(true);
      }, 2000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setBannerVisible(false);
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
    if (!deferredPrompt) {
      // Show install instructions immediately for unsupported browsers
      showBrowserSpecificInstructions();
      return;
    }

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        setShowBanner(false);
        setBannerVisible(false);
        showInstallSuccessMessage();
      } else {
        console.log('PWA: User dismissed the install prompt');
        // Keep banner visible but show additional help
        showBrowserSpecificInstructions();
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA: Install failed:', error);
      showBrowserSpecificInstructions();
    } finally {
      setIsInstalling(false);
    }
  };

  const showInstallSuccessMessage = () => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <span>App installed successfully!</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 4000);
  };

  const showBrowserSpecificInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    let instructions = '';
    let title = 'Install App';

    if (isIOS && isSafari) {
      title = 'Install on iPhone/iPad';
      instructions = `
        <ol class="list-decimal list-inside space-y-2 text-sm">
          <li>Tap the <strong>Share button</strong> (□ with ↑) at the bottom</li>
          <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
          <li>Tap <strong>"Add"</strong> to install the app</li>
        </ol>
      `;
    } else if (isChrome) {
      title = 'Install on Chrome';
      instructions = `
        <ol class="list-decimal list-inside space-y-2 text-sm">
          <li>Look for the <strong>install icon</strong> (⊞) in the address bar</li>
          <li>Or tap <strong>Chrome menu</strong> (⋮) → "Add to Home screen"</li>
          <li>Tap <strong>"Install"</strong> to add the app</li>
        </ol>
      `;
    } else if (isFirefox) {
      title = 'Install on Firefox';
      instructions = `
        <ol class="list-decimal list-inside space-y-2 text-sm">
          <li>Tap <strong>Firefox menu</strong> (☰)</li>
          <li>Select <strong>"Add to Home screen"</strong></li>
          <li>Confirm to install the app</li>
        </ol>
      `;
    } else {
      instructions = `
        <ol class="list-decimal list-inside space-y-2 text-sm">
          <li>Use your <strong>browser's menu</strong></li>
          <li>Look for <strong>"Add to Home Screen"</strong> or <strong>"Install"</strong></li>
          <li>Follow the prompts to install</li>
        </ol>
      `;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${title}</h3>
          <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" onclick="this.closest('.fixed').remove()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-3 text-gray-600 dark:text-gray-300 mb-6">
          ${instructions}
        </div>
        <button class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-200" onclick="this.closest('.fixed').remove()">
          Got it!
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setBannerVisible(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg border-b border-white/20 z-50 animate-slideDown">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg flex-shrink-0">
              <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xs sm:text-sm truncate">Install Air Monitor App</h3>
              <p className="text-xs opacity-90 hidden sm:block">
                Get quick access and offline features
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="
                flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-primary rounded-lg 
                hover:bg-gray-100 transition-all duration-200 disabled:opacity-50
                text-xs sm:text-sm font-medium whitespace-nowrap
              "
            >
              {isInstalling ? (
                <>
                  <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-primary border-t-transparent rounded-full" />
                  <span className="hidden sm:inline">Installing...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Install</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleDismiss}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              title="Dismiss"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
