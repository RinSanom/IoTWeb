#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🎨 Generating PWA icons from your new logo...');

const logoPath = path.join(__dirname, 'public', 'icons', 'logo.png');
const iconsDir = path.join(__dirname, 'public', 'icons');

// Check if the new logo exists
if (!fs.existsSync(logoPath)) {
  console.log('❌ Please save your new logo as /public/icons/logo.png first');
  console.log('💡 The logo should be a square PNG image, preferably 512x512 or larger');
  process.exit(1);
}

// Icon sizes needed for PWA
const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

async function generateIcons() {
  try {
    // Read the source logo
    const logoBuffer = fs.readFileSync(logoPath);
    
    console.log('📏 Generating icons in different sizes...');
    
    for (const icon of iconSizes) {
      const outputPath = path.join(iconsDir, icon.name);
      
      await sharp(logoBuffer)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
        
      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    }
    
    console.log('\n🎉 All PWA icons generated successfully!');
    console.log('📱 Your new logos are now ready for:');
    console.log('  - Mobile app icons');
    console.log('  - Browser tabs (favicon)');
    console.log('  - Progressive Web App installation');
    console.log('  - Apple Touch Icons');
    console.log('  - Android adaptive icons');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    
    if (error.message.includes('sharp')) {
      console.log('💡 Installing Sharp image processing library...');
      console.log('Run: npm install sharp');
    }
  }
}

generateIcons();
