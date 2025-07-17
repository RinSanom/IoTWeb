// Enhanced PWA registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Unregister any existing service workers first
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('PWA: Unregistered old service worker');
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('PWA: Cleared all caches');
      }
      
      // Register new service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('PWA: Service Worker registered successfully');
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
    } catch (error) {
      console.error('PWA: Service Worker registration failed:', error);
    }
  });
}

// Enhanced beforeinstallprompt handling
let deferredPrompt;
let installButton;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA: Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show custom install button
  showInstallButton();
});

window.addEventListener('appinstalled', () => {
  console.log('PWA: App installed successfully');
  hideInstallButton();
  deferredPrompt = null;
});

function showInstallButton() {
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    console.log('PWA: App already installed');
    return;
  }
  
  // Create floating install button
  if (!installButton) {
    installButton = document.createElement('div');
    installButton.innerHTML = `
      <button id="pwa-install-btn" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideIn 0.3s ease-out;
      ">
        📱 Install App
      </button>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    document.body.appendChild(installButton);
    
    document.getElementById('pwa-install-btn').addEventListener('click', installPWA);
    console.log('PWA: Install button shown');
  }
}

function hideInstallButton() {
  if (installButton) {
    installButton.remove();
    installButton = null;
  }
}

async function installPWA() {
  if (!deferredPrompt) return;
  
  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA: Install accepted');
    } else {
      console.log('PWA: Install dismissed');
    }
    
    deferredPrompt = null;
    hideInstallButton();
  } catch (error) {
    console.error('PWA: Install failed:', error);
  }
}

// Check if already installed
window.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    console.log('PWA: Running as installed app');
    document.body.classList.add('pwa-installed');
  }
});
