import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import ReduxProvider from "@/lib/store/ReduxProvider";
import PWAInstaller from "@/components/PWAInstaller";
// import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PWAInstallBanner from "@/components/ui/pwa-install-banner";
import { MobileInstallInstructions } from "@/components/MobileInstallInstructions";
import { IOSInstallPrompt } from "@/components/IOSInstallPrompt";
import { PWABannerProvider } from "@/contexts/PWABannerContext";
import { AirQualityProvider } from "@/contexts/AirQualityContext";
import NotificationFloatingButton from "@/components/ui/notification-floating-button";
import PWAInstallHelper from "@/lib/pwa-install-helper";
import PWADebugPanel from "@/components/PWADebugPanel";
import ChatbotFloatingButton from "@/components/ChatbotFloatingButton";

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
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Air Monitor",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://io-t-web-btit.vercel.app",
    siteName: "Air Pollution Monitor",
    title: "Air Pollution Monitor - Track & Protect Your Environment",
    description: "Monitor real-time air quality data, track pollution levels, and protect your health with our comprehensive air pollution monitoring platform.",
    images: [
      {
        url: "/image/image.png",
        width: 1200,
        height: 630,
        alt: "Air Pollution Monitor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Air Pollution Monitor - Track & Protect Your Environment",
    description: "Monitor real-time air quality data, track pollution levels, and protect your health with our comprehensive air pollution monitoring platform.",
    images: ["/image/image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  other: {
    "mobile-web-app-capable": "yes",
    "application-name": "Air Monitor",
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
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Air Monitor" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <script src="/pwa-enhanced.js" defer></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {/* <PWAInstallPrompt /> */}
        <PWABannerProvider>
          <AirQualityProvider>
            <ReduxProvider>
              <Header />
              {/* <PWAInstallBanner /> */}
              {children}
              <Footer />
              <NotificationFloatingButton />
              {/* <PWADebugPanel /> */}
              {/* <AuthDebug /> */}
              <ChatbotFloatingButton />
            </ReduxProvider>
          </AirQualityProvider>
        </PWABannerProvider>
        <MobileInstallInstructions />
        {/* <PWAInstaller /> */}
        {/* <IOSInstallPrompt /> */}
      
      </body>
    </html>
  );
}