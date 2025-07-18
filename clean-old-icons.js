#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Preparing to replace old logos...');

const iconsDir = path.join(__dirname, 'public', 'icons');

// List of old icon files to remove
const oldIcons = [
  'icon-72x72.png',
  'icon-96x96.png',
  'icon-128x128.png', 
  'icon-144x144.png',
  'icon-152x152.png',
  'icon-192x192.png',
  'icon-384x384.png',
  'icon-512x512.png'
];

console.log('🗑️  Removing old PWA icons...');

oldIcons.forEach(iconFile => {
  const iconPath = path.join(iconsDir, iconFile);
  if (fs.existsSync(iconPath)) {
    fs.unlinkSync(iconPath);
    console.log(`   ❌ Removed ${iconFile}`);
  }
});

console.log('\n✅ Old icons removed successfully!');
console.log('📝 Next steps:');
console.log('1. Save your new AP logo as public/icons/logo.png');
console.log('2. Run: node generate-new-icons.js');
console.log('3. Your new logo will be used everywhere!');

// Check if logo.png exists
const logoPath = path.join(iconsDir, 'logo.png');
if (fs.existsSync(logoPath)) {
  console.log('\n🎯 Found logo.png - ready to generate new icons!');
} else {
  console.log('\n⚠️  Please save your new logo as public/icons/logo.png first');
}
