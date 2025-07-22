"use client";

import dynamic from "next/dynamic";

// Make AlertSettings completely client-only
const AlertSettingsClient = dynamic(() => import("./AlertSettingsClient"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  ),
});

export default function AlertSettings() {
  return <AlertSettingsClient />;
}
