# Google Maps Integration Setup

## Getting Started

To use the Google Maps integration in the Air Quality Map component, you'll need to obtain a Google Maps API key and configure it in your project.

## Step 1: Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for future features)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

## Step 2: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

## Step 3: Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## Features

The Google Maps integration includes:

- **Interactive Map**: Real Google Maps with custom styling
- **AQI Markers**: Color-coded markers showing air quality levels
- **Info Windows**: Detailed information when clicking markers
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Fullscreen Mode**: Expand map to full screen
- **Legend**: Visual guide for AQI color coding

## Map Styling

The map uses a custom style that:

- Simplifies the appearance for better marker visibility
- Reduces visual clutter by hiding unnecessary POIs
- Uses a clean, professional color scheme
- Maintains good contrast for accessibility

## Responsive Features

- **Mobile**: Compact layout with touch-friendly controls
- **Tablet**: Balanced layout with medium-sized elements
- **Desktop**: Full-featured layout with all controls visible

## Troubleshooting

### Map Not Loading

- Check that your API key is valid and properly set
- Ensure the Maps JavaScript API is enabled in Google Cloud Console
- Verify there are no billing issues with your Google Cloud account

### Markers Not Showing

- Check browser console for JavaScript errors
- Ensure the marker data has valid latitude/longitude coordinates

### API Key Errors

- Make sure the API key is not restricted to exclude your domain
- Check that the key has permission to use the Maps JavaScript API

## Security Best Practices

1. **Restrict API Key**: Limit usage to your specific domains
2. **Set Quotas**: Configure usage limits to prevent unexpected charges
3. **Monitor Usage**: Regularly check API usage in Google Cloud Console
4. **Environment Variables**: Never commit API keys to version control

## Cost Considerations

Google Maps API usage is metered and may incur charges:

- First 28,000 map loads per month are free
- Additional usage is charged per 1,000 map loads
- Consider implementing caching strategies for production

For current pricing, visit: https://cloud.google.com/maps-platform/pricing
