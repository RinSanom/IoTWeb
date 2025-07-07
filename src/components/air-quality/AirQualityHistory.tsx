"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrendingUp, TrendingDown } from "lucide-react";

const historyData = [
  {
    date: "Today",
    time: "14:30",
    aqi: 85,
    status: "Moderate",
    statusColor: "bg-yellow-500",
    change: "+8",
    trend: "up",
  },
  {
    date: "Today",
    time: "13:30",
    aqi: 77,
    status: "Moderate",
    statusColor: "bg-yellow-500",
    change: "-3",
    trend: "down",
  },
  {
    date: "Today",
    time: "12:30",
    aqi: 80,
    status: "Moderate",
    statusColor: "bg-yellow-500",
    change: "+5",
    trend: "up",
  },
  {
    date: "Today",
    time: "11:30",
    aqi: 75,
    status: "Moderate",
    statusColor: "bg-yellow-500",
    change: "-2",
    trend: "down",
  },
  {
    date: "Yesterday",
    time: "22:00",
    aqi: 65,
    status: "Good",
    statusColor: "bg-green-500",
    change: "-8",
    trend: "down",
  },
  {
    date: "Yesterday",
    time: "18:00",
    aqi: 95,
    status: "Moderate",
    statusColor: "bg-yellow-500",
    change: "+12",
    trend: "up",
  },
];

const weeklyHistory = [
  { day: "Monday", avgAqi: 72, status: "Good", trend: "down", change: -5 },
  { day: "Tuesday", avgAqi: 85, status: "Moderate", trend: "up", change: +13 },
  { day: "Wednesday", avgAqi: 68, status: "Good", trend: "down", change: -17 },
  { day: "Thursday", avgAqi: 92, status: "Moderate", trend: "up", change: +24 },
  { day: "Friday", avgAqi: 78, status: "Moderate", trend: "down", change: -14 },
  { day: "Saturday", avgAqi: 65, status: "Good", trend: "down", change: -13 },
  { day: "Sunday", avgAqi: 85, status: "Moderate", trend: "up", change: +20 },
];

export default function AirQualityHistory() {
  return (
    <div className="space-y-6" data-aos="fade-up" data-aos-delay="500">
      {/* Recent Readings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Readings
          </CardTitle>
          <CardDescription>Last 6 hourly measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historyData.map((reading, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 ${reading.statusColor} rounded-full`}
                  ></div>
                  <div>
                    <div className="font-medium text-sm">{reading.time}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {reading.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {reading.aqi}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {reading.status}
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      reading.trend === "up"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {reading.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {reading.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Summary
          </CardTitle>
          <CardDescription>Daily averages for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyHistory.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      day.status === "Good" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <div>
                    <div className="font-medium text-sm">{day.day}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {day.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-primary">
                    {day.avgAqi}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      day.trend === "up"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {day.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {day.change > 0 ? "+" : ""}
                    {day.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Air Quality Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Air quality warnings and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-yellow-500 text-white">Moderate</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  2 hours ago
                </span>
              </div>
              <p className="text-sm">
                Air quality reached moderate levels. Sensitive individuals
                should limit outdoor activities.
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-green-500 text-white">Good</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Yesterday
                </span>
              </div>
              <p className="text-sm">
                Air quality improved to good levels. Safe for all outdoor
                activities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
