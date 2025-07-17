# PWA Push Notifications Implementation

This document outlines the implementation of push notifications in the Air Quality Monitoring PWA that alerts users when air quality levels exceed 50% (AQI > 100).

## 🔔 Features Implemented

### 1. Service Worker with Push Notification Support
- **File**: `/public/sw-notifications.js`
- Handles push messages and displays notifications
- Manages notification clicks and background sync
- Automatically checks air quality levels every 10 minutes

### 2. Notification Service
- **File**: `/src/lib/services/notificationService.ts`
- Manages notification permissions and subscriptions
- Provides methods for sending local and push notifications
- Handles VAPID key management for secure push messaging

### 3. Notification Settings UI
- **File**: `/src/components/ui/notification-settings.tsx`
- User-friendly interface for managing notification preferences
- Allows users to set custom AQI thresholds (50-200)
- Includes test notification functionality

### 4. Enhanced Air Quality Context
- **File**: `/src/contexts/AirQualityContext.tsx`
- Integrated with notification service
- Automatically triggers notifications when AQI exceeds threshold
- Prevents notification spam with smart filtering

### 5. Floating Notification Button
- **File**: `/src/components/ui/notification-floating-button.tsx`
- Quick access to notification controls
- Auto-suggests notification setup when AQI is high
- Visual status indicators for notification state

## 🚀 How It Works

### Notification Trigger Logic
```typescript
// Notifications are triggered when:
1. AQI > user-defined threshold (default: 100)
2. AQI has increased significantly (>10 points)
3. User has notifications enabled
4. Time since last notification > 30 minutes (prevents spam)
```

### AQI Threshold Mapping
- **50-100**: Moderate (Yellow alert)
- **100-150**: Unhealthy for Sensitive Groups (Orange alert)
- **150-200**: Unhealthy (Red alert)
- **200+**: Very Unhealthy/Hazardous (Purple/Maroon alert)

### Notification Types
1. **Local Notifications**: Immediate alerts when app is open
2. **Background Notifications**: Alerts when app is closed (via service worker)
3. **Test Notifications**: User-triggered for testing functionality

## 📱 User Experience

### First-Time Setup
1. User installs the PWA
2. When AQI exceeds 100, auto-popup suggests enabling notifications
3. One-click enable with immediate test notification
4. Customizable threshold settings available

### Ongoing Usage
- Floating notification button shows current status
- Green: Notifications active
- Yellow: Notifications available but not configured
- Red: Notifications blocked
- Settings page provides full control

### Notification Content
```
Title: "Air Quality Alert! 🚨"
Body: "Air quality is unhealthy (AQI: 125). Consider staying indoors."
Actions: [View Details] [Dismiss]
```

## 🔧 Technical Implementation

### API Endpoints
- `GET /api/air-quality/latest` - Returns current AQI data
- `POST /api/notifications/subscribe` - Saves push subscription
- `POST /api/notifications/unsubscribe` - Removes subscription

### Key Components
1. **NotificationService**: Core notification logic
2. **useNotifications**: React hook for notification state
3. **NotificationSettings**: Settings UI component
4. **NotificationFloatingButton**: Quick access controls

### Browser Support
- ✅ Chrome/Chromium browsers
- ✅ Firefox
- ✅ Safari (limited support)
- ✅ Edge
- ❌ IE (not supported)

## 🛠️ Setup Instructions

### 1. VAPID Keys (Production Setup)
```bash
# Generate VAPID keys for production
npx web-push generate-vapid-keys

# Update the public key in notificationService.ts
```

### 2. Service Worker Registration
The service worker is automatically registered when the notification service initializes.

### 3. Manifest Permissions
```json
{
  "permissions": ["notifications"],
  "protocol_handlers": [
    {
      "protocol": "web+airquality",
      "url": "/air-quality?data=%s"
    }
  ]
}
```

## 🧪 Testing

### Test Notification Feature
1. Navigate to Settings page
2. Enable notifications
3. Use "Send Test" button
4. Verify notification appears

### Test Air Quality Alerts
1. Use the floating notification button
2. Click "Test Alert" when notifications are enabled
3. Or manually trigger via browser console:
```javascript
// Simulate high AQI
notificationService.checkAirQualityAndNotify(150);
```

## 📊 Monitoring & Analytics

### User Engagement Metrics
- Notification permission grant rate
- Click-through rate on notifications
- Settings page usage
- Threshold customization patterns

### Technical Metrics
- Service worker registration success rate
- Push subscription success rate
- Notification delivery rate
- Background sync performance

## 🔒 Privacy & Security

### Data Collection
- Only stores user preference settings locally
- Push subscriptions stored server-side for delivery
- No personal data transmitted with notifications

### Security Measures
- VAPID keys for authenticated push messaging
- HTTPS required for push notifications
- Content Security Policy headers

## 🚨 Troubleshooting

### Common Issues
1. **Notifications not appearing**: Check browser permissions
2. **Service worker not registering**: Verify HTTPS and file paths
3. **High AQI not triggering alerts**: Check threshold settings
4. **Push messages not received**: Verify VAPID key configuration

### Debug Tools
- Browser Developer Tools > Application > Service Workers
- Browser Developer Tools > Application > Notifications
- Console logs with detailed error messages

## 🔄 Future Enhancements

### Planned Features
1. **Location-based notifications**: Different thresholds for different areas
2. **Scheduled quiet hours**: Disable notifications during sleep
3. **Rich notifications**: Include charts and trend data
4. **Notification history**: Track past alerts and patterns
5. **Integration with health apps**: Share data with fitness trackers

### Performance Optimizations
1. **Intelligent batching**: Group multiple alerts
2. **Adaptive polling**: Adjust check frequency based on air quality trends
3. **Background sync**: Better offline support
4. **Memory optimization**: Reduce service worker memory usage

---

## 📞 Support

For technical issues or feature requests related to notifications:
1. Check browser compatibility
2. Verify HTTPS is enabled
3. Review console logs for errors
4. Test with different browsers

The notification system enhances user safety by providing timely alerts about air quality deterioration, encouraging protective behaviors when pollution levels become unhealthy.
