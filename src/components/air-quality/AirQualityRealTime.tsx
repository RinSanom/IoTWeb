"use client";

import { useGetLatestAirQualityQuery, useGetAirQualityDataQuery } from '@/lib/services/airQualityApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { Thermometer, Wind, Droplets, Activity } from 'lucide-react';

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
  return new Date(timestamp).toLocaleString();
};

export default function AirQualityMonitor() {
  const { 
    data: latestData, 
    error: latestError, 
    isLoading: latestLoading, 
    refetch: refetchLatest 
  } = useGetLatestAirQualityQuery(undefined, {
    pollingInterval: 30000, // Refetch every 10 seconds
  });

  const { 
    data: allData, 
    error: allError, 
    isLoading: allLoading,
    refetch: refetchAll
  } = useGetAirQualityDataQuery(undefined, {
    pollingInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    refetchLatest();
    refetchAll();
  }, [refetchLatest, refetchAll]);

  if (latestLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading air quality data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (latestError || allError) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load air quality data</p>
            <p className="text-sm text-gray-600">
              Make sure your MQTT Python server is running on http://127.0.0.1:8000
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestData) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-gray-600">No air quality data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Current Air Quality Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Current Air Quality</CardTitle>
            <Badge className={getAQICategoryColor(latestData.aqi_category)}>
              {latestData.aqi_category}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            Last updated: {formatTimestamp(latestData.timestamp)}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* PM2.5 */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Wind className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">PM2.5</p>
                <p className="text-xl font-bold">{latestData.pm2_5} μg/m³</p>
              </div>
            </div>

            {/* PM10 */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Wind className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">PM10</p>
                <p className="text-xl font-bold">{latestData.pm10} μg/m³</p>
              </div>
            </div>

            {/* NO2 */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">NO₂</p>
                <p className="text-xl font-bold">{latestData.no2} μg/m³</p>
              </div>
            </div>

            {/* O3 */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Droplets className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">O₃</p>
                <p className="text-xl font-bold">{latestData.o3} μg/m³</p>
              </div>
            </div>
          </div>

          {/* Additional pollutants */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">CO</p>
              <p className="text-lg font-bold">{latestData.co} mg/m³</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">SO₂</p>
              <p className="text-lg font-bold">{latestData.so2} μg/m³</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">NH₃</p>
              <p className="text-lg font-bold">{latestData.nh3} μg/m³</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Pb</p>
              <p className="text-lg font-bold">{latestData.pb} μg/m³</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Readings */}
      {allData && allData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">PM2.5</th>
                    <th className="text-left p-2">PM10</th>
                    <th className="text-left p-2">NO₂</th>
                    <th className="text-left p-2">O₃</th>
                  </tr>
                </thead>
                <tbody>
                  {allData.slice(0, 10).map((reading, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{formatTimestamp(reading.timestamp)}</td>
                      <td className="p-2">
                        <Badge className={getAQICategoryColor(reading.aqi_category)} variant="outline">
                          {reading.aqi_category}
                        </Badge>
                      </td>
                      <td className="p-2">{reading.pm2_5}</td>
                      <td className="p-2">{reading.pm10}</td>
                      <td className="p-2">{reading.no2}</td>
                      <td className="p-2">{reading.o3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
