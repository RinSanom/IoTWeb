"use client";

import dynamic from "next/dynamic";

// Make NotificationSettings completely client-only to avoid hydration issues
const NotificationSettingsClient = dynamic(
  () => import("./notification-settings-client"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ),
  }
);

export default function NotificationSettings() {
  return <NotificationSettingsClient />;
}
