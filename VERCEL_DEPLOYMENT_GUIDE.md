# Vercel Deployment Configuration for io-t-web-six.vercel.app

## ✅ **Domain Configuration Complete**

Your PWA app is now configured to work with the domain: **https://io-t-web-six.vercel.app**

## 📋 **What Was Updated**

### 1. **Next.js Configuration** (`next.config.ts`)
- Added `io-t-web-six.vercel.app` to allowed image domains
- Enhanced PWA configuration for production deployment

### 2. **Environment Variables**
- **Local Development** (`.env.local`): Updated with production domain info
- **Production** (`.env.production`): Created with production-specific settings
- **Vercel Config** (`vercel.json`): Environment variables for deployment

### 3. **Notification Service** (`notificationService.ts`)
- Updated API endpoints to work with production domain
- Enhanced error handling for cross-origin requests
- Added support for dynamic URL resolution

### 4. **PWA Manifest** (`manifest.json`)
- Already properly configured with relative paths (works with any domain)

### 5. **Vercel Configuration** (`vercel.json`)
- Service Worker headers and caching rules
- Proper PWA manifest configuration
- Build and deployment settings

## 🚀 **Deployment Steps**

### **Option A: Automatic Vercel Deployment**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy using the configuration

### **Option B: Manual Vercel CLI Deployment**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🔧 **Vercel Environment Variables Setup**

In your Vercel dashboard, make sure to set these environment variables:

```bash
NEXT_PUBLIC_APP_URL=https://io-t-web-six.vercel.app
NEXT_PUBLIC_DOMAIN=io-t-web-six.vercel.app
NEXT_PUBLIC_WEATHER_API=https://api.open-meteo.com/v1/
NEXT_PUBLIC_AIR_QUALITY_API=https://io-t-web-six.vercel.app/api/air-quality
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BB4iCbS53b7COBOQniz27IWOWj3juVPWFmbSz48LOAvKscI7lpy2dPFMJcdBTEzPegsQLP8L2ueFC_yBuHQPy94
VAPID_PRIVATE_KEY=zD-Eg7ercAAQ8z84V0zXogwMgRhjJdQy4rqPvahpypE
VAPID_EMAIL=admin@io-t-web-six.vercel.app
```

## 📱 **PWA Features That Will Work**

### ✅ **Supported Features**
- **Service Worker**: Auto-registration across domains
- **Push Notifications**: VAPID keys configured for production
- **Offline Mode**: Cached resources and offline page
- **Install Prompt**: Add to Home Screen functionality
- **Background Sync**: Air quality data updates
- **App Shortcuts**: Quick access to dashboard

### 🔄 **Cross-Domain Compatibility**
- Works on `localhost:3000` (development)
- Works on `https://io-t-web-six.vercel.app` (production)
- Automatic API endpoint resolution
- Dynamic origin handling for notifications

## 🧪 **Testing Checklist**

After deployment, test these features:

1. **PWA Installation**
   - [ ] Visit https://io-t-web-six.vercel.app
   - [ ] Look for "Install App" prompt
   - [ ] Install and verify standalone mode

2. **Push Notifications**
   - [ ] Enable notifications in app
   - [ ] Test notification functionality
   - [ ] Verify VAPID key works in production

3. **Offline Mode**
   - [ ] Disconnect internet
   - [ ] Verify app still loads
   - [ ] Check offline page functionality

4. **Service Worker**
   - [ ] Check DevTools > Application > Service Workers
   - [ ] Verify SW is registered and active

## 🛠️ **Troubleshooting**

### **If Service Worker Issues:**
- Check browser DevTools > Console for errors
- Verify `/sw.js` is accessible at root domain
- Clear browser cache and hard refresh

### **If Notification Issues:**
- Verify VAPID keys are set in Vercel environment
- Check browser notification permissions
- Test in different browsers

### **If PWA Install Issues:**
- Verify all PWA criteria are met
- Check manifest.json is accessible
- Ensure HTTPS is working

## 📞 **Support**

The app is now fully configured for the domain. Deploy to Vercel and test all PWA features!
