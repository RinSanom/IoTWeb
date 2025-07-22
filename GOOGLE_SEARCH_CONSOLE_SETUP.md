# Google Search Console Setup Guide

## Step 1: Add Your Site to Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Click "Add Property"
3. Enter your URL: `https://io-t-web-btit.vercel.app`
4. Choose "URL prefix" method

## Step 2: Verify Ownership
Add this meta tag to your layout.tsx head section:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

## Step 3: Submit Your Sitemap
1. In Search Console, go to "Sitemaps"
2. Submit: `https://io-t-web-btit.vercel.app/sitemap.xml`

## Step 4: Request Indexing
1. Go to "URL Inspection"
2. Enter your homepage URL
3. Click "Request Indexing"

## Current Status Check
Run these commands to check your current SEO status:
```bash
# Check if your site is indexed
site:io-t-web-btit.vercel.app

# Check if robots.txt is accessible
curl https://io-t-web-btit.vercel.app/robots.txt

# Check if sitemap is accessible
curl https://io-t-web-btit.vercel.app/sitemap.xml
```
