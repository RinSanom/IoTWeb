"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface SensorData {
  co_ppm: number;
  h2s_ppm: number;
  ch4_ppm: number;
  o2_percent: number;
}

interface SensorReading {
  timestamp: string;
  sensor_id: string;
  sensor_type: string;
  data: SensorData;
  status: string;
  quality_level: number;
  quality_description: string;
}

interface SensorApiResponse {
  status: {
    system_status: string;
    timestamp: string;
    client_id: string;
    active_sensors: number;
    readings_this_cycle: number;
    uptime_cycles: number;
  };
  [key: string]: any;
  alerts?: {
    sensor_id: string;
    alert_type: string;
    message: string;
    severity: string;
    timestamp: string;
  };
}

const getQualityColor = (description: string) => {
  switch (description.toUpperCase()) {
    case 'GOOD':
      return 'bg-green-500 text-white';
    case 'MODERATE':
      return 'bg-yellow-500 text-white';
    case 'UNHEALTHY FOR SENSITIVE GROUPS':
      return 'bg-orange-500 text-white';
    case 'UNHEALTHY':
      return 'bg-red-500 text-white';
    case 'VERY UNHEALTHY':
      return 'bg-purple-500 text-white';
    case 'HAZARDOUS':
      return 'bg-red-800 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'good':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'moderate':
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    default:
      return <XCircle className="h-5 w-5 text-red-600" />;
  }
};

export default function RealTimeSensorDisplay() {
  const [sensorData, setSensorData] = useState<SensorApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_AIR_QUALITY_API;
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(`${apiUrl}/api/latest`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      setSensorData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchSensorData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !sensorData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Real-Time Sensor Data...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error && !sensorData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Sensor Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchSensorData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry Connection
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!sensorData) return null;

  // Find sensor reading
  const sensorKeys = Object.keys(sensorData).filter(key => 
    key !== 'status' && key !== 'alerts' && typeof sensorData[key] === 'object'
  );
  
  const sensorReading: SensorReading | null = sensorKeys.length > 0 ? sensorData[sensorKeys[0]] : null;

  return (
    <div className="space-y-4">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>System Status</span>
            <Badge 
              variant={sensorData.status.system_status === 'running' ? 'default' : 'destructive'}
            >
              {sensorData.status.system_status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Active Sensors</p>
              <p className="font-semibold">{sensorData.status.active_sensors}</p>
            </div>
            <div>
              <p className="text-gray-600">Uptime Cycles</p>
              <p className="font-semibold">{sensorData.status.uptime_cycles}</p>
            </div>
            <div>
              <p className="text-gray-600">Readings This Cycle</p>
              <p className="font-semibold">{sensorData.status.readings_this_cycle}</p>
            </div>
            <div>
              <p className="text-gray-600">Last Update</p>
              <p className="font-semibold text-xs">
                {new Date(sensorData.status.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Reading */}
      {sensorReading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Air Quality Reading</span>
              <Badge className={getQualityColor(sensorReading.quality_description)}>
                {sensorReading.quality_description}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Carbon Monoxide</p>
                <p className="text-2xl font-bold text-red-600">{sensorReading.data.co_ppm}</p>
                <p className="text-xs text-gray-500">ppm</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Hydrogen Sulfide</p>
                <p className="text-2xl font-bold text-orange-600">{sensorReading.data.h2s_ppm}</p>
                <p className="text-xs text-gray-500">ppm</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Methane</p>
                <p className="text-2xl font-bold text-blue-600">{sensorReading.data.ch4_ppm}</p>
                <p className="text-xs text-gray-500">ppm</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Oxygen</p>
                <p className="text-2xl font-bold text-green-600">{sensorReading.data.o2_percent}</p>
                <p className="text-xs text-gray-500">%</p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Sensor ID:</strong> {sensorReading.sensor_id}</p>
              <p><strong>Status:</strong> {sensorReading.status}</p>
              <p><strong>Quality Level:</strong> {sensorReading.quality_level}/6</p>
              <p><strong>Last Reading:</strong> {new Date(sensorReading.timestamp).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      {sensorData.alerts && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Active Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="destructive">{sensorData.alerts.severity}</Badge>
              <p className="font-semibold">{sensorData.alerts.alert_type.replace(/_/g, ' ').toUpperCase()}</p>
              <p className="text-sm">{sensorData.alerts.message}</p>
              <p className="text-xs text-gray-600">
                Alert Time: {new Date(sensorData.alerts.timestamp).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh button */}
      <div className="flex justify-center">
        <button
          onClick={fetchSensorData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
}
