Please follow these steps to replace your logos:

1. SAVE YOUR NEW LOGO:
   - Take your new "AP" logo (the one with cloud and wind elements)
   - Save it as: /public/icons/logo.png
   - Make sure it's a square PNG image (512x512 pixels recommended)

2. INSTALL SHARP (if not already installed):
   npm install sharp

3. GENERATE ALL PWA ICONS:
   node generate-new-icons.js

This will automatically create:
- icon-72x72.png
- icon-96x96.png  
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

4. UPDATE SERVICE WORKER:
   The service worker will automatically detect the new icons on next build.

Files that reference your logo:
- src/layout/Header.tsx (main website logo)
- public/manifest.json (PWA icons)
- public/browserconfig.xml (Windows tile)
- All meta tags in layout.tsx

Your new logo will appear in:
✅ Website header
✅ Browser tabs (favicon)  
✅ PWA installation prompts
✅ Mobile home screen icons
✅ App splash screens
✅ Notification icons
