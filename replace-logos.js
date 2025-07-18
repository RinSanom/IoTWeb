#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Starting logo replacement process...');

// First, let's backup the old logo
const oldLogoPath = path.join(__dirname, 'public', 'icons', 'logo.png');
const backupPath = path.join(__dirname, 'public', 'icons', 'logo-old.png');

if (fs.existsSync(oldLogoPath)) {
  fs.copyFileSync(oldLogoPath, backupPath);
  console.log('✅ Backed up old logo to logo-old.png');
}

console.log('📝 Instructions to replace logos:');
console.log('1. Save your new logo as /public/icons/logo.png');
console.log('2. Run: node generate-icons.js to generate all PWA icons');
console.log('3. The script will create all required icon sizes automatically');

// List all files that need to be updated
const filesToUpdate = [
  'public/icons/icon-72x72.png',
  'public/icons/icon-96x96.png', 
  'public/icons/icon-128x128.png',
  'public/icons/icon-144x144.png',
  'public/icons/icon-152x152.png',
  'public/icons/icon-192x192.png',
  'public/icons/icon-384x384.png',
  'public/icons/icon-512x512.png'
];

console.log('\n📋 PWA Icons that will be updated:');
filesToUpdate.forEach(file => {
  console.log(`  - ${file}`);
});

console.log('\n🔍 Files that reference logos:');
console.log('  - src/layout/Header.tsx (main logo)');
console.log('  - public/manifest.json (PWA icons)');
console.log('  - public/browserconfig.xml (Windows tiles)');
console.log('  - src/app/layout.tsx (meta tags)');
