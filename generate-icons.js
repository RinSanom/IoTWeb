#!/usr/bin/env node

// This script generates different sized icons from the base logo
// Run with: node generate-icons.js

const fs = require('fs');
const path = require('path');

console.log('PWA Icon Generation Guide');
console.log('========================');
console.log('');
console.log('To create proper PWA icons, you need to:');
console.log('');
console.log('1. Take your base logo (/public/icons/logo.png)');
console.log('2. Create these sizes:');
console.log('   - 72x72 px    (Android small)');
console.log('   - 96x96 px    (Android medium)');
console.log('   - 128x128 px  (Android large)');
console.log('   - 144x144 px  (Android extra large)');
console.log('   - 152x152 px  (iOS)');
console.log('   - 192x192 px  (Android standard)');
console.log('   - 384x384 px  (Android large)');
console.log('   - 512x512 px  (Android extra large)');
console.log('');
console.log('3. Save them as:');
console.log('   - /public/icons/icon-72x72.png');
console.log('   - /public/icons/icon-96x96.png');
console.log('   - /public/icons/icon-128x128.png');
console.log('   - /public/icons/icon-144x144.png');
console.log('   - /public/icons/icon-152x152.png');
console.log('   - /public/icons/icon-192x192.png');
console.log('   - /public/icons/icon-384x384.png');
console.log('   - /public/icons/icon-512x512.png');
console.log('');
console.log('4. For now, I\'ll copy the existing logo to create placeholders');

// Create icon directory if it doesn't exist
const iconDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Copy existing logo to different sizes (placeholder)
const logoPath = path.join(__dirname, 'public', 'icons', 'logo.png');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

if (fs.existsSync(logoPath)) {
  sizes.forEach(size => {
    const iconPath = path.join(iconDir, `icon-${size}x${size}.png`);
    fs.copyFileSync(logoPath, iconPath);
    console.log(`✓ Created ${iconPath}`);
  });
  console.log('');
  console.log('✓ Placeholder icons created! Replace them with properly sized versions for best results.');
} else {
  console.log('❌ Base logo not found at /public/icons/logo.png');
  console.log('Please add your logo first, then run this script again.');
}
