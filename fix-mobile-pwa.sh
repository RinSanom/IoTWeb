#!/bin/bash

echo "🔧 Fixing Mobile PWA Issues..."

# Step 1: Check and fix manifest.json for mobile compatibility
echo "📱 Fixing manifest.json for mobile devices..."

# Step 2: Update service worker with proper mobile handling
echo "🔄 Updating service worker for mobile compatibility..."

# Step 3: Fix PWA registration for mobile browsers
echo "📲 Fixing PWA registration for mobile browsers..."

# Step 4: Clear all caches and rebuild
echo "🧹 Clearing caches and rebuilding..."
rm -rf .next
rm -rf public/sw.js
rm -rf public/workbox-*.js
rm -rf public/fallback-*.js

# Step 5: Build with mobile-optimized settings
echo "🔨 Building with mobile optimizations..."
npm run build

# Step 6: Test manifest accessibility
echo "🌐 Testing manifest accessibility..."
if [ -f "public/manifest.json" ]; then
    echo "✅ Manifest file exists"
else
    echo "❌ Manifest file missing!"
fi

# Step 7: Verify icon files
echo "🖼️ Verifying icon files..."
for size in 72x72 96x96 128x128 144x144 152x152 192x192 384x384 512x512; do
    if [ -f "public/icons/icon-${size}.png" ]; then
        echo "✅ Icon ${size} exists"
    else
        echo "❌ Icon ${size} missing!"
    fi
done

echo ""
echo "🎯 Mobile PWA Troubleshooting Complete!"
echo ""
echo "📋 Mobile Testing Checklist:"
echo "1. Open https://io-t-web-btit.vercel.app/ on mobile Chrome/Safari"
echo "2. Check Developer Tools > Application > Manifest"
echo "3. Look for install prompt or 'Add to Home Screen' option"
echo "4. Verify all icons load properly"
echo "5. Test offline functionality"
echo ""
echo "🔍 If PWA still doesn't work on mobile:"
echo "   • Clear browser cache and data"
echo "   • Try different mobile browsers (Chrome, Safari, Edge)"
echo "   • Check if HTTPS is working properly"
echo "   • Verify manifest.json is accessible at /manifest.json"
