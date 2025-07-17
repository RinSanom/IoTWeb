"use client";

// Global PWA install helper
export class PWAInstallHelper {
  private static deferredPrompt: any = null;
  private static isInstalled = false;

  static init() {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    PWAInstallHelper.isInstalled = isStandalone;

    if (isStandalone) return;

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      PWAInstallHelper.deferredPrompt = e;
    };

    const handleAppInstalled = () => {
      PWAInstallHelper.isInstalled = true;
      PWAInstallHelper.deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
  }

  static async install(): Promise<boolean> {
    if (PWAInstallHelper.isInstalled) {
      PWAInstallHelper.showAlreadyInstalledMessage();
      return false;
    }

    if (!PWAInstallHelper.deferredPrompt) {
      PWAInstallHelper.showBrowserSpecificInstructions();
      return false;
    }

    try {
      await PWAInstallHelper.deferredPrompt.prompt();
      const { outcome } = await PWAInstallHelper.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        PWAInstallHelper.showInstallSuccessMessage();
        PWAInstallHelper.deferredPrompt = null;
        return true;
      } else {
        PWAInstallHelper.showBrowserSpecificInstructions();
        return false;
      }
    } catch (error) {
      console.error('PWA: Install failed:', error);
      PWAInstallHelper.showBrowserSpecificInstructions();
      return false;
    }
  }

  static canInstall(): boolean {
    return !PWAInstallHelper.isInstalled && PWAInstallHelper.deferredPrompt !== null;
  }

  static getIsInstalled(): boolean {
    return PWAInstallHelper.isInstalled;
  }

  private static showInstallSuccessMessage() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300 animate-slideInRight';
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <div>
          <div class="font-semibold">App Installed!</div>
          <div class="text-sm opacity-90">Find it on your home screen</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 4000);
  }

  private static showAlreadyInstalledMessage() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300';
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <div>
          <div class="font-semibold">App Already Installed!</div>
          <div class="text-sm opacity-90">Check your home screen</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }

  private static showBrowserSpecificInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isEdge = /Edge/.test(navigator.userAgent);

    let title = 'Install App';
    let instructions = '';
    let icon = '📱';

    if (isIOS && isSafari) {
      title = 'Install on iPhone/iPad';
      icon = '🍎';
      instructions = `
        <div class="space-y-3">
          <p class="text-sm text-gray-600 dark:text-gray-300">Follow these steps to install:</p>
          <ol class="list-decimal list-inside space-y-2 text-sm font-medium">
            <li>Tap the <strong class="text-blue-600">Share button</strong> <span class="text-xl">⬆️</span> at the bottom</li>
            <li>Scroll down and tap <strong class="text-green-600">"Add to Home Screen"</strong> <span class="text-xl">➕</span></li>
            <li>Tap <strong class="text-purple-600">"Add"</strong> to install the app <span class="text-xl">✅</span></li>
          </ol>
        </div>
      `;
    } else if (isChrome) {
      title = 'Install on Chrome';
      icon = '🌐';
      instructions = `
        <div class="space-y-3">
          <p class="text-sm text-gray-600 dark:text-gray-300">Follow these steps to install:</p>
          <ol class="list-decimal list-inside space-y-2 text-sm font-medium">
            <li>Look for the <strong class="text-blue-600">install icon</strong> <span class="text-xl">⊞</span> in the address bar</li>
            <li>Or tap <strong class="text-green-600">Chrome menu</strong> <span class="text-xl">⋮</span> → "Add to Home screen"</li>
            <li>Tap <strong class="text-purple-600">"Install"</strong> to add the app <span class="text-xl">📲</span></li>
          </ol>
        </div>
      `;
    } else if (isFirefox) {
      title = 'Install on Firefox';
      icon = '🦊';
      instructions = `
        <div class="space-y-3">
          <p class="text-sm text-gray-600 dark:text-gray-300">Follow these steps to install:</p>
          <ol class="list-decimal list-inside space-y-2 text-sm font-medium">
            <li>Tap <strong class="text-blue-600">Firefox menu</strong> <span class="text-xl">☰</span></li>
            <li>Select <strong class="text-green-600">"Add to Home screen"</strong> <span class="text-xl">🏠</span></li>
            <li>Confirm to install the app <span class="text-xl">✅</span></li>
          </ol>
        </div>
      `;
    } else if (isEdge) {
      title = 'Install on Edge';
      icon = '⚡';
      instructions = `
        <div class="space-y-3">
          <p class="text-sm text-gray-600 dark:text-gray-300">Follow these steps to install:</p>
          <ol class="list-decimal list-inside space-y-2 text-sm font-medium">
            <li>Look for the <strong class="text-blue-600">install icon</strong> <span class="text-xl">⊞</span> in the address bar</li>
            <li>Or tap <strong class="text-green-600">Edge menu</strong> <span class="text-xl">⋯</span> → "Add to Home screen"</li>
            <li>Tap <strong class="text-purple-600">"Install"</strong> to add the app <span class="text-xl">📲</span></li>
          </ol>
        </div>
      `;
    } else {
      instructions = `
        <div class="space-y-3">
          <p class="text-sm text-gray-600 dark:text-gray-300">Follow these general steps:</p>
          <ol class="list-decimal list-inside space-y-2 text-sm font-medium">
            <li>Use your <strong class="text-blue-600">browser's menu</strong> <span class="text-xl">☰</span></li>
            <li>Look for <strong class="text-green-600">"Add to Home Screen"</strong> or <strong class="text-green-600">"Install"</strong> <span class="text-xl">📲</span></li>
            <li>Follow the prompts to install <span class="text-xl">✅</span></li>
          </ol>
        </div>
      `;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl transform animate-slideInUp">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${icon}</span>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">${title}</h3>
          </div>
          <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1" onclick="this.closest('.fixed').remove()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="text-gray-600 dark:text-gray-300 mb-6">
          ${instructions}
        </div>
        <div class="flex gap-3">
          <button class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200" onclick="this.closest('.fixed').remove()">
            Maybe Later
          </button>
          <button class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-200" onclick="this.closest('.fixed').remove()">
            Got it! 👍
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    PWAInstallHelper.init();
  });
  
  // Also initialize immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PWAInstallHelper.init();
    });
  } else {
    PWAInstallHelper.init();
  }
}

export default PWAInstallHelper;
