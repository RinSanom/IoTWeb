"use client";

import dynamic from "next/dynamic";

// Dynamically import the client component with no SSR
const SettingsClient = dynamic(
  () => import("@/components/settings/SettingsClient"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
  }
);

export default function NotificationSettingsPage() {
  return <SettingsClient />;
}
