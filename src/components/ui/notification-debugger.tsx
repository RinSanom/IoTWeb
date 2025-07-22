"use client";

import dynamic from "next/dynamic";

// Make NotificationDebugger completely client-only to avoid hydration issues
const NotificationDebuggerClient = dynamic(
  () => import("./notification-debugger-client"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ),
  }
);

export default function NotificationDebugger() {
  return <NotificationDebuggerClient />;
}
