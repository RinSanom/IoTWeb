"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Tooltip,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

const chartData = [
  { time: "00:00", aqi: 65, pm25: 25, pm10: 35, o3: 80 },
  { time: "03:00", aqi: 72, pm25: 28, pm10: 38, o3: 85 },
  { time: "06:00", aqi: 85, pm25: 35, pm10: 45, o3: 95 },
  { time: "09:00", aqi: 92, pm25: 42, pm10: 52, o3: 105 },
  { time: "12:00", aqi: 88, pm25: 38, pm10: 48, o3: 100 },
  { time: "15:00", aqi: 95, pm25: 45, pm10: 55, o3: 110 },
  { time: "18:00", aqi: 102, pm25: 52, pm10: 62, o3: 115 },
  { time: "21:00", aqi: 78, pm25: 32, pm10: 42, o3: 88 },
];

const weeklyData = [
  { day: "Mon", aqi: 75, pm25: 30, pm10: 40 },
  { day: "Tue", aqi: 82, pm25: 35, pm10: 45 },
  { day: "Wed", aqi: 68, pm25: 25, pm10: 35 },
  { day: "Thu", aqi: 95, pm25: 45, pm10: 55 },
  { day: "Fri", aqi: 88, pm25: 38, pm10: 48 },
  { day: "Sat", aqi: 72, pm25: 28, pm10: 38 },
  { day: "Sun", aqi: 85, pm25: 35, pm10: 45 },
];

const chartConfig = {
  aqi: {
    label: "AQI",
    color: "hsl(var(--primary))",
  },
  pm25: {
    label: "PM2.5",
    color: "hsl(var(--chart-1))",
  },
  pm10: {
    label: "PM10",
    color: "hsl(var(--chart-2))",
  },
  o3: {
    label: "O3",
    color: "hsl(var(--chart-3))",
  },
};

export default function AirQualityChart() {
  return (
    <div
      className="space-y-3 sm:space-y-4 lg:space-y-6"
      data-aos="fade-up"
      data-aos-delay="400"
    >
      {/* 24-Hour Trend */}
      <Card className="w-full">
        <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            24-Hour Air Quality Trend
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Hourly AQI and pollutant levels
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="h-40 sm:h-48 md:h-56 lg:h-72 xl:h-80 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  fontSize={10}
                  className="text-[10px] sm:text-xs lg:text-sm"
                  interval="preserveStartEnd"
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 0.5 }}
                />
                <YAxis
                  fontSize={10}
                  className="text-[10px] sm:text-xs lg:text-sm"
                  width={25}
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 0.5 }}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: "11px",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stackId="1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                  strokeWidth={1.5}
                  className="cursor-pointer"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card className="w-full">
        <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Weekly Overview
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Daily average air quality index
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="h-40 sm:h-48 md:h-56 lg:h-72 xl:h-80 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart
                data={weeklyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="day"
                  fontSize={10}
                  className="text-[10px] sm:text-xs lg:text-sm"
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 0.5 }}
                />
                <YAxis
                  fontSize={10}
                  className="text-[10px] sm:text-xs lg:text-sm"
                  width={25}
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 0.5 }}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: "11px",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="aqi"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 1, r: 3 }}
                  className="sm:stroke-[2.5px] lg:stroke-[3px] sm:[&>circle]:r-[3.5px] lg:[&>circle]:r-4 sm:[&>circle]:stroke-[1.5px] lg:[&>circle]:stroke-2"
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pollutant Breakdown */}
      <Card className="w-full">
        <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
          <CardTitle className="text-sm sm:text-base lg:text-lg">
            Pollutant Breakdown
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Current levels of major pollutants
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="h-40 sm:h-48 md:h-56 lg:h-72 xl:h-80 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  fontSize={10}
                  className="text-[10px] sm:text-xs lg:text-sm"
                  interval="preserveStartEnd"
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 0.5 }}
                />
                <YAxis
                  fontSize={10}
                  className="text-[10px] sm:text-xs lg:text-sm"
                  width={25}
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 0.5 }}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: "11px",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pm25"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="pm10"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="o3"
                  stackId="1"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.6}
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
