// Extended Notification API types for PWA
export interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  badge?: string;
  tag?: string;
  data?: any;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface AirQualityNotificationData {
  aqi: number;
  location?: string;
  pollutants?: any;
  timestamp: number;
}

export interface PushSubscriptionData {
  subscription: PushSubscriptionJSON;
  timestamp: number;
}

export interface AQISeverity {
  level: string;
  emoji: string;
  advice: string;
  color: string;
}
