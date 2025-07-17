import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import ReduxProvider from "@/lib/store/ReduxProvider";
import PWAInstaller from "@/components/PWAInstaller";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PWAInstallBanner from "@/components/ui/pwa-install-banner";
import { MobileInstallInstructions } from "@/components/MobileInstallInstructions";
import { PWABannerProvider } from "@/contexts/PWABannerContext";
import { AirQualityProvider } from "@/contexts/AirQualityContext";
import NotificationFloatingButton from "@/components/ui/notification-floating-button";
import PWAInstallHelper from "@/lib/pwa-install-helper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Air Pollution Monitor - Track & Protect Your Environment",
    template: "%s | Air Pollution Monitor"
  },
  description: "Monitor real-time air quality data, track pollution levels, and protect your health with our comprehensive air pollution monitoring platform. Get weather updates and environmental insights.",
  keywords: [
    "air pollution",
    "air quality",
    "environmental monitoring",
    "weather tracking",
    "pollution data",    
    "health protection",
    "environmental health",
    "air quality index",
    "pollution monitoring",
    "environmental awareness"
  ],
  authors: [{ name: "Air Pollution Monitor Team" }],
  creator: "Air Pollution Monitor",
  publisher: "Air Pollution Monitor",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://14eab50ee750.ngrok-free.app/",
    siteName: "Air Pollution Monitor",
    title: "Air Pollution Monitor - Track & Protect Your Environment",
    description: "Monitor real-time air quality data, track pollution levels, and protect your health with our comprehensive air pollution monitoring platform.",
    images: [
      {
        url: "https://imgs.search.brave.com/XkE856Cspco6DkBVd3GJ1F9qbywtIKkqpgLHTphFO6I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMx/NTM4MjMzMy9waG90/by9pbmRvb3ItYWly/LXF1YWxpdHktbWVh/c3VyZW1lbnQtY28y/LW1vbml0b3IuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPUVE/eGI2bnFwa3p4Q3d3/aWZ6RGpna0hKQUVj/M1JVNm5USHhtRjhR/WXlJeUk9",
        width: 1200,
        height: 630,
        alt: "Air Pollution Monitoring Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Air Pollution Monitor - Track & Protect Your Environment",
    description: "Monitor real-time air quality data, track pollution levels, and protect your health with our comprehensive air pollution monitoring platform.",
    images: ["https://imgs.search.brave.com/XkE856Cspco6DkBVd3GJ1F9qbywtIKkqpgLHTphFO6I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMx/NTM4MjMzMy9waG90/by9pbmRvb3ItYWly/LXF1YWxpdHktbWVh/c3VyZW1lbnQtY28y/LW1vbml0b3IuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPUVE/eGI2bnFwa3p4Q3d3/aWZ6RGpna0hKQUVj/M1JVNm5USHhtRjhR/WXlJeUk9"],
    creator: "@airpollutionmonitor",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/icons/icon-192x192.png",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/icons/icon-152x152.png",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Air Monitor",
    startupImage: [
      "/icons/icon-512x512.png",
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Air Monitor",
    "application-name": "Air Pollution Monitor",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#2563eb",
  },
  category: "environmental",
  classification: "Environmental Monitoring",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://14eab50ee750.ngrok-free.app/"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Air Monitor" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAInstallPrompt />
        <MobileInstallInstructions />
        <PWABannerProvider>
          <AirQualityProvider>
            <ReduxProvider>
              <Header />
              <PWAInstallBanner />
              {children}
              <Footer />
              <NotificationFloatingButton />
              {/* <AuthDebug /> */}
            </ReduxProvider>
          </AirQualityProvider>
        </PWABannerProvider>
        <PWAInstaller />
      </body>
    </html>
  );
}