// Push Notification Service
import { ExtendedNotificationOptions, AQISeverity } from '../../types/notifications';

export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  // VAPID keys - using environment variable for security
  private readonly VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BB4iCbS53b7COBOQniz27IWOWj3juVPWFmbSz48LOAvKscI7lpy2dPFMJcdBTEzPegsQLP8L2ueFC_yBuHQPy94';

  private constructor() {  } 

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize the service
  public async initialize(): Promise<void> {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        console.warn('Not in browser environment, skipping service worker registration');
        return;
      }

      // Validate VAPID key before proceeding
      if (!this.validateVAPIDKey(this.VAPID_PUBLIC_KEY)) {
        console.error('Invalid VAPID public key detected!');
        console.error('Current key:', this.VAPID_PUBLIC_KEY);
        console.error('Please check your .env.local file and ensure NEXT_PUBLIC_VAPID_PUBLIC_KEY is properly set');
        throw new Error('Invalid VAPID public key configuration');
      }

      console.log('VAPID key validation passed');

      if ('serviceWorker' in navigator) {
        // First try to register our notification service worker
        try {
          this.registration = await navigator.serviceWorker.register('/sw-notifications.js');
          console.log('Notification Service Worker registered successfully');
        } catch (swError) {
          console.warn('Notification SW failed, trying main SW:', swError);
          // Fallback to main service worker
          this.registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Main Service Worker registered as fallback');
        }
        
        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;
        
        // Set up periodic air quality checks
        this.setupPeriodicChecks();
      } else {
        throw new Error('Service Worker not supported');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  // Request notification permission (Mobile-safe version)
  public async requestPermission(): Promise<NotificationPermission> {
    console.log('Requesting notification permission...');
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.error('This browser does not support notifications or not in browser environment');
      throw new Error('This browser does not support notifications');
    }

    let permission = Notification.permission;
    console.log('Current permission status:', permission);

    if (permission === 'default') {
      // Mobile-safe permission request
      try {
        // For PWA/mobile, avoid direct Notification.requestPermission() 
        // Instead, provide instructions to user
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // On mobile, show instructions instead of calling constructor
          console.log('Mobile detected, showing permission instructions');
          const message = 'To enable notifications:\n\n' +
                         '1. Look for the notification/bell icon in your browser\n' +
                         '2. Or go to browser Settings > Site Settings > Notifications\n' +
                         '3. Allow notifications for this site\n' +
                         '4. Refresh the page and try again';
          
          alert(message);
          return 'default'; // Return default, let user manually enable
        } else {
          // On desktop, try the normal way with error handling
          try {
            permission = await Notification.requestPermission();
            console.log('Permission request result:', permission);
          } catch (error) {
            console.error('Error requesting permission:', error);
            // Fallback to instructions
            alert('Please manually enable notifications in your browser settings');
            return 'default';
          }
        }
      } catch (error) {
        console.error('Error in permission request flow:', error);
        return 'default';
      }
    }

    if (permission === 'granted') {
      console.log('Permission granted, setting up push subscription...');
      try {
        await this.subscribeToPush();
        // Enable notifications in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('air-quality-notifications-enabled', 'true');
        }
        console.log('Notifications enabled and configured');
      } catch (error) {
        console.error('Error setting up push subscription:', error);
        // Don't throw here, basic notifications might still work
      }
    } else if (permission === 'denied') {
      console.warn('Notification permission denied');
      if (typeof window !== 'undefined') {
        localStorage.setItem('air-quality-notifications-enabled', 'false');
      }
    }

    return permission;
  }

  // Check if notifications are supported and enabled
  public isNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 
           typeof navigator !== 'undefined' &&
           'Notification' in window && 
           'serviceWorker' in navigator && 
           'PushManager' in window;
  }

  // Get current permission status
  public getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'default';
    }
    return Notification.permission;
  }

  // Subscribe to push notifications
  private async subscribeToPush(): Promise<void> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return;
    }

    try {
      // Validate VAPID key before proceeding
      if (!this.VAPID_PUBLIC_KEY || this.VAPID_PUBLIC_KEY.length < 50) {
        throw new Error('Invalid VAPID public key. Please check your environment configuration.');
      }

      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription();
      
      if (!this.subscription) {
        console.log('Creating new push subscription with VAPID key...');
        
        // Create new subscription
        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY)
        });
        
        console.log('Push subscription created successfully:', this.subscription);
        
        // Send subscription to server (you'll need to implement this endpoint)
        await this.sendSubscriptionToServer(this.subscription);
      } else {
        console.log('Push subscription already exists');
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      
      // Provide helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('applicationServerKey')) {
          console.error('VAPID key error: The applicationServerKey is invalid or malformed');
          console.error('Current VAPID key:', this.VAPID_PUBLIC_KEY);
          console.error('Please check your .env.local file and ensure NEXT_PUBLIC_VAPID_PUBLIC_KEY is properly set');
        }
      }
      
      throw error;
    }
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      // Use environment variable for API base URL or fall back to current origin
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
      const endpoint = `${apiUrl}/api/notifications/subscribe`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          timestamp: Date.now(),
          origin: typeof window !== 'undefined' ? window.location.origin : apiUrl
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send subscription to server: ${response.status}`);
      }

      console.log('Subscription sent to server successfully');
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  }

  // Show local notification (Mobile-safe version)
  public async showLocalNotification(title: string, options: ExtendedNotificationOptions = {}): Promise<void> {
    try {
      // Check if notifications are supported
      if (typeof window === 'undefined' || !('Notification' in window)) {
        console.error('Notifications not supported');
        return;
      }

      // Check permission
      if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted. Current permission:', Notification.permission);
        return;
      }

      const defaultOptions: ExtendedNotificationOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        requireInteraction: true,
        tag: 'air-quality-local',
        silent: false
      };

      const finalOptions = { ...defaultOptions, ...options };
      console.log('Creating notification with options:', finalOptions);

      // Mobile-safe notification creation using Service Worker
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          
          // Use ServiceWorkerRegistration.showNotification (mobile-safe)
          await registration.showNotification(title, {
            body: finalOptions.body,
            icon: finalOptions.icon,
            badge: finalOptions.badge,
            tag: finalOptions.tag,
            requireInteraction: finalOptions.requireInteraction,
            silent: finalOptions.silent,
            data: finalOptions.data
          });
          
          console.log('Mobile-safe notification created successfully');
        } else {
          console.warn('Service Worker not available, notification not shown');
        }
      } catch (swError) {
        console.error('Service Worker notification failed:', swError);
        // For desktop fallback only - avoid on mobile
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (!isMobile) {
          try {
            // Desktop fallback using regular Notification API
            const notification = new Notification(title, finalOptions as NotificationOptions);
            
            notification.onclick = () => {
              console.log('Notification clicked');
              notification.close();
              
              if (finalOptions.data?.url && typeof window !== 'undefined') {
                window.open(finalOptions.data.url, '_blank');
              } else if (typeof window !== 'undefined') {
                // Focus the app window
                window.focus();
              }
            };
            
            console.log('Desktop fallback notification created');
          } catch (desktopError) {
            console.error('Desktop notification fallback failed:', desktopError);
          }
        }
      }

      console.log('Notification created successfully');
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Check air quality and send notification if needed
  public async checkAirQualityAndNotify(currentAQI: number, data?: any): Promise<void> {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        console.log('Not in browser environment, skipping notification check');
        return;
      }

      // Get user's notification preferences
      const notificationsEnabled = localStorage.getItem('air-quality-notifications-enabled');
      const isEnabled = notificationsEnabled ? JSON.parse(notificationsEnabled) : false;
      
      if (!isEnabled) {
        console.log('Notifications are disabled by user');
        return;
      }

      // Get user's threshold setting
      const savedThreshold = localStorage.getItem('air-quality-threshold');
      const threshold = savedThreshold ? parseInt(savedThreshold, 10) : 100;
      
      // Check if current AQI exceeds user's threshold
      if (currentAQI > threshold) {
        // Check if we've sent a notification recently to avoid spam
        const lastNotificationTime = localStorage.getItem('last-notification-time');
        const now = Date.now();
        const cooldownPeriod = 30 * 60 * 1000; // 30 minutes
        
        if (lastNotificationTime && (now - parseInt(lastNotificationTime, 10)) < cooldownPeriod) {
          console.log('Notification cooldown active, skipping notification');
          return;
        }

        const severity = this.getAQISeverity(currentAQI);
        
        // Send notification
        await this.showLocalNotification(
          `Air Quality Alert! ${severity.emoji}`,
          {
            body: `Air quality is ${severity.level} (AQI: ${currentAQI}). ${severity.advice}`,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: 'air-quality-alert',
            requireInteraction: true,
            vibrate: [300, 200, 300],
            actions: [
              {
                action: 'view',
                title: 'View Details'
              },
              {
                action: 'dismiss',
                title: 'Dismiss'
              }
            ],
            data: {
              aqi: currentAQI,
              url: '/air-quality',
              timestamp: Date.now()
            }
          }
        );

        // Update last notification time
        localStorage.setItem('last-notification-time', now.toString());

        // Also trigger service worker background notification
        if (this.registration?.active) {
          this.registration.active.postMessage({
            type: 'AIR_QUALITY_ALERT',
            data: { aqi: currentAQI, threshold, ...data }
          });
        }
        
        console.log(`Notification sent for AQI: ${currentAQI} (threshold: ${threshold})`);
      } else {
        console.log(`AQI ${currentAQI} below threshold ${threshold}, no notification needed`);
      }
    } catch (error) {
      console.error('Error in checkAirQualityAndNotify:', error);
    }
  }

  // Get AQI severity information
  private getAQISeverity(aqi: number): AQISeverity {
    if (aqi <= 50) {
      return { level: 'Good', emoji: '🟢', advice: 'Air quality is satisfactory.', color: '#10b981' };
    } else if (aqi <= 100) {
      return { level: 'Moderate', emoji: '🟡', advice: 'Consider reducing outdoor activities.', color: '#f59e0b' };
    } else if (aqi <= 150) {
      return { level: 'Unhealthy for Sensitive Groups', emoji: '🟠', advice: 'Sensitive individuals should avoid outdoor activities.', color: '#f97316' };
    } else if (aqi <= 200) {
      return { level: 'Unhealthy', emoji: '🔴', advice: 'Everyone should avoid outdoor activities.', color: '#ef4444' };
    } else if (aqi <= 300) {
      return { level: 'Very Unhealthy', emoji: '🟣', advice: 'Stay indoors and keep windows closed.', color: '#8b5cf6' };
    } else {
      return { level: 'Hazardous', emoji: '🆘', advice: 'Emergency conditions. Stay indoors at all times.', color: '#991b1b' };
    }
  }

  // Set up periodic air quality checks
  private setupPeriodicChecks(): void {
    // Check every 10 minutes
    setInterval(async () => {
      try {
        const response = await fetch('/api/air-quality/latest');
        if (response.ok) {
          const data = await response.json();
          await this.checkAirQualityAndNotify(data.aqi, data);
        }
      } catch (error) {
        console.error('Error in periodic air quality check:', error);
      }
    }, 10 * 60 * 1000); // 10 minutes
  }

  // Convert VAPID key from base64url to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    try {
      // Validate input
      if (!base64String || typeof base64String !== 'string') {
        throw new Error('Invalid base64 string provided');
      }

      // Add padding if needed
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      
      // Convert from base64url to base64
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      if (typeof window === 'undefined') {
        // Server-side fallback
        console.warn('Running on server-side, returning empty Uint8Array');
        return new Uint8Array(0);
      }

      // Decode base64
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      
      console.log('VAPID key converted successfully, length:', outputArray.length);
      return outputArray;
    } catch (error) {
      console.error('Error converting VAPID key:', error);
      console.error('Input base64 string:', base64String);
      throw new Error(`Failed to convert VAPID key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Unsubscribe from notifications
  public async unsubscribe(): Promise<void> {
    if (this.subscription) {
      await this.subscription.unsubscribe();
      this.subscription = null;
      
      // Notify server about unsubscription
      try {
        const apiUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
        const endpoint = `${apiUrl}/api/notifications/unsubscribe`;
        
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            timestamp: Date.now(),
            origin: typeof window !== 'undefined' ? window.location.origin : apiUrl
          })
        });
      } catch (error) {
        console.error('Error notifying server about unsubscription:', error);
      }
    }
  }

  // Get subscription status
  public async getSubscriptionStatus(): Promise<boolean> {
    if (!this.registration) return false;
    
    const subscription = await this.registration.pushManager.getSubscription();
    return !!subscription;
  }

  // Test notification functionality (for debugging)
  public async testNotification(): Promise<void> {
    console.log('=== Testing Notification System ===');
    
    // Check browser support
    console.log('Browser environment:', typeof window !== 'undefined');
    console.log('Notification support:', typeof window !== 'undefined' && 'Notification' in window);
    console.log('ServiceWorker support:', typeof navigator !== 'undefined' && 'serviceWorker' in navigator);
    console.log('PushManager support:', typeof window !== 'undefined' && 'PushManager' in window);
    
    // Check VAPID key
    console.log('VAPID key configured:', !!this.VAPID_PUBLIC_KEY);
    console.log('VAPID key length:', this.VAPID_PUBLIC_KEY?.length || 0);
    console.log('VAPID key source:', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? 'Environment' : 'Fallback');
    
    // Test VAPID key conversion
    try {
      const vapidArray = this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY);
      console.log('VAPID key conversion successful, array length:', vapidArray.length);
      console.log('VAPID key is valid format');
    } catch (error) {
      console.error('VAPID key conversion failed:', error);
    }
    
    // Check current permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      console.log('Current permission:', Notification.permission);
    } else {
      console.log('Current permission: not available (server-side)');
    }
    
    // Check if notifications are enabled in settings
    if (typeof window !== 'undefined') {
      const notificationsEnabled = localStorage.getItem('air-quality-notifications-enabled');
      console.log('Notifications enabled in settings:', notificationsEnabled);
    } else {
      console.log('Notifications enabled in settings: not available (server-side)');
    }
    
    // Check threshold
    if (typeof window !== 'undefined') {
      const threshold = localStorage.getItem('air-quality-threshold');
      console.log('Current threshold:', threshold);
    } else {
      console.log('Current threshold: not available (server-side)');
    }
    
    // Try to send a test notification
    try {
      await this.showLocalNotification(
        'Test Notification 🧪',
        {
          body: 'This is a test to verify notifications are working correctly.',
          tag: 'test-notification',
          requireInteraction: false
        }
      );
      console.log('Test notification sent successfully');
    } catch (error) {
      console.error('Test notification failed:', error);
    }
    
    console.log('=== End Test ===');
  }

  // Validate VAPID key format
  private validateVAPIDKey(key: string): boolean {
    if (!key || typeof key !== 'string') {
      return false;
    }
    
    // VAPID keys should be base64url encoded and typically 65+ characters
    const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
    return base64UrlPattern.test(key) && key.length >= 50;
  }

  // Force trigger a high AQI notification for testing
  public async triggerTestAlert(testAQI: number = 150): Promise<void> {
    console.log(`Triggering test alert with AQI: ${testAQI}`);
    await this.checkAirQualityAndNotify(testAQI, { location: 'Test Location', timestamp: Date.now() });
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
