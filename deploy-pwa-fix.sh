#!/bin/bash

echo "🚀 Deploying PWA Fix to Production..."

# Clean build artifacts
echo "🧹 Cleaning build cache..."
rm -rf .next
rm -rf public/sw.js
rm -rf public/workbox-*.js
rm -rf public/fallback-*.js

# Rebuild with fresh cache
echo "🔨 Building fresh production build..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "📤 Deploying to GitHub..."
    git add .
    git commit -m "🚀 Fix PWA domain issues and clear service worker cache"
    git push origin main
    
    echo "✅ Deployed successfully!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Wait for Vercel deployment to complete"
    echo "2. Visit: https://io-t-web-btit.vercel.app/"
    echo "3. Check for floating 📱 Install App button"
    echo "4. Verify PWA Debug Panel shows green status"
    echo "5. Test installation in Chrome/Edge"
    echo ""
    echo "🔍 The PWA should now work correctly without domain errors!"
    
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi
