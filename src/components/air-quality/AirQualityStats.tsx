"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const statsData = [
  {
    title: "Today's Average",
    value: "82",
    unit: "AQI",
    change: "+5",
    trend: "up",
    icon: TrendingUp,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    title: "Weekly Average",
    value: "78",
    unit: "AQI",
    change: "-3",
    trend: "down",
    icon: TrendingDown,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Unhealthy Days",
    value: "2",
    unit: "this week",
    change: "+1",
    trend: "up",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    title: "Good Days",
    value: "5",
    unit: "this week",
    change: "+2",
    trend: "up",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
];

export default function AirQualityStats() {
  return (
    <div
      className="space-y-4 sm:space-y-6"
      data-aos="fade-up"
      data-aos-delay="300"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-3 sm:p-4">
              <div className={`${stat.bgColor} rounded-lg p-3 sm:p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`}
                  />
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      stat.trend === "up"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {stat.unit}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                  {stat.title}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Recommendations */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Health Recommendations
          </CardTitle>
          <CardDescription>Based on current air quality</CardDescription>
        </CardHeader>
        <CardContent>
          {healthRecommendations.map((rec, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 ${rec.color} rounded-full`}></div>
                <span className="font-medium">{rec.level} Air Quality</span>
              </div>
              <ul className="space-y-2 ml-5">
                {rec.recommendations.map((recommendation, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                  >
                    <span className="text-primary">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card> */}

      {/* Air Quality Index Scale */}
      <Card>
        <CardHeader>
          <CardTitle>AQI Scale</CardTitle>
          <CardDescription>
            Air Quality Index ranges and meanings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Good</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                0-50
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Moderate</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                51-100
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">
                  Unhealthy for Sensitive
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                101-150
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Unhealthy</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                151-200
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Very Unhealthy</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                201-300
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
