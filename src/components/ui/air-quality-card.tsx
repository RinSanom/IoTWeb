"use client";

import React from "react";

interface AirQualityCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color?: "blue" | "orange" | "red" | "green" | "purple" | "yellow";
}

export default function AirQualityCard({
  title,
  value,
  unit,
  icon,
  color = "blue",
}: AirQualityCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    yellow:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  };

  return (
    <div
      className={`rounded-2xl p-6 border-2 ${colorClasses[color]} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {title}
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="flex items-end gap-1">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        {unit && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}
