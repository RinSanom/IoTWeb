"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useGetAirQualityDataQuery } from '@/lib/services/airQualityApi';

const getAQICategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'good':
      return 'bg-green-500 text-white';
    case 'moderate':
    case 'fair':
      return 'bg-yellow-500 text-white';
    case 'unhealthy for sensitive groups':
      return 'bg-orange-500 text-white';
    case 'unhealthy':
      return 'bg-red-500 text-white';
    case 'very unhealthy':
      return 'bg-purple-500 text-white';
    case 'hazardous':
      return 'bg-maroon-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateTrend = (current: number, previous: number) => {
  if (!previous) return { trend: 'neutral', change: 0 };
  const change = current - previous;
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  return { trend, change: Math.abs(change) };
};

const getStatusFromCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'good':
      return 'Good';
    case 'moderate':
    case 'fair':
      return 'Moderate';
    case 'unhealthy for sensitive groups':
      return 'USG';
    case 'unhealthy':
      return 'Unhealthy';
    case 'very unhealthy':
      return 'Very Unhealthy';
    case 'hazardous':
      return 'Hazardous';
    default:
      return 'Unknown';
  }
};

export default function AirQualityHistory() {
  const { 
    data: allData, 
    error, 
    isLoading 
  } = useGetAirQualityDataQuery(undefined, {
    pollingInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Failed to load history data</p>
            <p className="text-sm text-gray-500">Please check your connection</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!allData || allData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No history data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get recent readings (last 50 for better history)
  const recentReadings = allData.slice(0, 50);

  return (
    <div className="space-y-6" data-aos="fade-up" data-aos-delay="500">
      {/* Recent Readings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Readings
          </CardTitle>
          <CardDescription>Last {recentReadings.length} measurements from your sensors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
            {recentReadings.map((reading, index) => {
              const prevReading = allData[index + 1];
              const pm25Trend = prevReading ? calculateTrend(reading.pm2_5, prevReading.pm2_5) : { trend: 'neutral', change: 0 };
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {new Date(reading.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium">{formatTimestamp(reading.timestamp)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">PM2.5</p>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">{reading.pm2_5}</span>
                        {pm25Trend.trend !== 'neutral' && (
                          pm25Trend.trend === 'up' ? 
                            <TrendingUp className="h-4 w-4 text-red-500" /> : 
                            <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">PM10</p>
                      <span className="text-lg font-bold">{reading.pm10}</span>
                    </div>

                    <Badge className={getAQICategoryColor(reading.aqi_category)}>
                      {getStatusFromCategory(reading.aqi_category)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
