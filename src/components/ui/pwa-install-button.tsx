"use client";

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

export default function PWAInstallButton({ 
  className = '', 
  variant = 'default' 
}: PWAInstallButtonProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    setIsInstalled(isStandalone);

    if (isStandalone) return;

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
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
      // Fallback for browsers that don't support beforeinstallprompt
      handleFallbackInstall();
      return;
    }

    setIsInstalling(true);

    try {
      // Automatically show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        // Show success message
        showInstallSuccess();
      } else {
        console.log('PWA: User dismissed the install prompt');
        // Show alternative install instructions
        showInstallInstructions();
      }
      
      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (error) {
      console.error('PWA: Install failed:', error);
      // Show fallback install instructions
      handleFallbackInstall();
    } finally {
      setIsInstalling(false);
    }
  };

  const handleFallbackInstall = () => {
    // Auto-detect browser and show appropriate instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (isIOS && isSafari) {
      showIOSInstallInstructions();
    } else if (isChrome) {
      showChromeInstallInstructions();
    } else if (isFirefox) {
      showFirefoxInstallInstructions();
    } else {
      showGenericInstallInstructions();
    }
  };

  const showInstallSuccess = () => {
    // Create a temporary success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fadeIn';
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
      document.body.removeChild(notification);
    }, 3000);
  };

  const showInstallInstructions = () => {
    // Create modal with install instructions
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Install App</h3>
        <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <p>To install this app:</p>
          <ol class="list-decimal list-inside space-y-2">
            <li>Look for the install icon in your browser's address bar</li>
            <li>Or use your browser's menu → "Add to Home Screen"</li>
            <li>Follow the prompts to install</li>
          </ol>
        </div>
        <button class="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90" onclick="this.closest('.fixed').remove()">
          Got it
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

  const showIOSInstallInstructions = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Install on iPhone/iPad</h3>
        <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <ol class="list-decimal list-inside space-y-2">
            <li>Tap the Share button (□ with ↑)</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" to install the app</li>
          </ol>
        </div>
        <button class="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90" onclick="this.closest('.fixed').remove()">
          Got it
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

  const showChromeInstallInstructions = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Install on Chrome</h3>
        <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <ol class="list-decimal list-inside space-y-2">
            <li>Look for the install icon (⊞) in the address bar</li>
            <li>Or tap Chrome menu (⋮) → "Add to Home screen"</li>
            <li>Tap "Install" to add the app</li>
          </ol>
        </div>
        <button class="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90" onclick="this.closest('.fixed').remove()">
          Got it
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

  const showFirefoxInstallInstructions = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Install on Firefox</h3>
        <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <ol class="list-decimal list-inside space-y-2">
            <li>Tap Firefox menu (☰)</li>
            <li>Select "Add to Home screen"</li>
            <li>Confirm to install the app</li>
          </ol>
        </div>
        <button class="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90" onclick="this.closest('.fixed').remove()">
          Got it
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

  const showGenericInstallInstructions = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Install App</h3>
        <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <p>To install this app on your device:</p>
          <ol class="list-decimal list-inside space-y-2">
            <li>Use your browser's menu</li>
            <li>Look for "Add to Home Screen" or "Install"</li>
            <li>Follow the prompts</li>
          </ol>
        </div>
        <button class="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90" onclick="this.closest('.fixed').remove()">
          Got it
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

  // Don't show button if not installable or already installed
  if (!canInstall || isInstalled) {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`
          p-2 rounded-lg bg-primary text-white hover:bg-primary/90 
          disabled:opacity-50 transition-all duration-200
          ${className}
        `}
        title="Install App"
        data-pwa-install
      >
        {isInstalling ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Download className="h-5 w-5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isInstalling}
      className={`
        flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg 
        hover:bg-primary/90 transition-all duration-200 disabled:opacity-50
        ${className}
      `}
      data-pwa-install
    >
      {isInstalling ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          Installing...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Install App
        </>
      )}
    </button>
  );
}
