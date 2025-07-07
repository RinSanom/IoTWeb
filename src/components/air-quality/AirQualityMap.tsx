"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GoogleMapsWrapper,
  Map,
  Marker,
  InfoWindow,
} from "@/components/ui/google-map";
import { Satellite, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";

const mapData = [
  {
    id: 1,
    location: "Phnom Penh Central",
    aqi: 85,
    lat: 11.5564,
    lng: 104.9282,
    color: "bg-yellow-500",
    status: "Moderate",
    pollutants: { pm25: 35, pm10: 50, o3: 120 },
  },
  {
    id: 2,
    location: "Toul Kork",
    aqi: 72,
    lat: 11.5818,
    lng: 104.9109,
    color: "bg-green-500",
    status: "Good",
    pollutants: { pm25: 25, pm10: 40, o3: 95 },
  },
  {
    id: 3,
    location: "Russian Market",
    aqi: 95,
    lat: 11.5386,
    lng: 104.9145,
    color: "bg-orange-500",
    status: "Moderate",
    pollutants: { pm25: 45, pm10: 60, o3: 130 },
  },
  {
    id: 4,
    location: "Olympic Market",
    aqi: 68,
    lat: 11.5625,
    lng: 104.9195,
    color: "bg-green-500",
    status: "Good",
    pollutants: { pm25: 22, pm10: 35, o3: 85 },
  },
  {
    id: 5,
    location: "Riverside",
    aqi: 78,
    lat: 11.5625,
    lng: 104.928,
    color: "bg-yellow-500",
    status: "Moderate",
    pollutants: { pm25: 32, pm10: 45, o3: 105 },
  },
];

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "#10b981"; // green
  if (aqi <= 100) return "#f59e0b"; // yellow
  if (aqi <= 150) return "#f97316"; // orange
  if (aqi <= 200) return "#ef4444"; // red
  if (aqi <= 300) return "#8b5cf6"; // purple
  return "#7f1d1d"; // dark red
};

const createMarkerIcon = (aqi: number): google.maps.Symbol | undefined => {
  // Check if Google Maps is loaded
  if (typeof window === 'undefined' || !(window as unknown as { google: typeof google }).google || !(window as unknown as { google: typeof google }).google.maps) {
    return undefined;
  }

  const color = getAQIColor(aqi);
  const googleMaps = (window as unknown as { google: typeof google }).google.maps;
  return {
    path: googleMaps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 0.8,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: 12,
  };
};

export default function AirQualityMap() {
  const [selectedStation, setSelectedStation] = useState<
    (typeof mapData)[0] | null
  >(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const center = { lat: 11.5564, lng: 104.9282 }; // Phnom Penh center
  const zoom = 12;

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setIsMapLoaded(true);
    console.log("Map loaded:", mapInstance);
  }, []);

  const handleMarkerClick = (station: (typeof mapData)[0]) => {
    setSelectedStation(station);
  };

  const handleInfoWindowClose = () => {
    setSelectedStation(null);
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className="space-y-4 sm:space-y-6"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Satellite className="h-4 w-4 sm:h-5 sm:w-5" />
                  Air Quality Map
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Real-time air quality monitoring stations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="font-medium">Google Maps API Key Required</p>
              <p className="text-sm mt-1">
                Please add your Google Maps API key to the .env.local file
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="space-y-4 sm:space-y-6"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Satellite className="h-4 w-4 sm:h-5 sm:w-5" />
                Air Quality Map
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Real-time air quality monitoring stations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-xs"
              >
                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div
            className={`relative ${
              isFullscreen ? "h-screen" : "h-64 sm:h-80 md:h-96"
            } bg-gray-100 dark:bg-gray-800`}
          >
            <GoogleMapsWrapper apiKey={apiKey}>
              <Map
                center={center}
                zoom={zoom}
                className="w-full h-full"
                onMapLoad={handleMapLoad}
              >
                {isMapLoaded && mapData.map((station) => (
                  <Marker
                    key={station.id}
                    position={{ lat: station.lat, lng: station.lng }}
                    title={`${station.location}: AQI ${station.aqi}`}
                    icon={createMarkerIcon(station.aqi)}
                    onClick={() => handleMarkerClick(station)}
                  />
                ))}

                {selectedStation && isMapLoaded && (
                  <InfoWindow
                    position={{
                      lat: selectedStation.lat,
                      lng: selectedStation.lng,
                    }}
                    onCloseClick={handleInfoWindowClose}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-semibold text-sm">
                        {selectedStation.location}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">AQI:</span>
                          <span
                            className="font-bold text-sm"
                            style={{ color: getAQIColor(selectedStation.aqi) }}
                          >
                            {selectedStation.aqi}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedStation.status}
                        </div>
                        <div className="mt-2 pt-2 border-t text-xs space-y-1">
                          <div className="flex justify-between">
                            <span>PM2.5:</span>
                            <span>{selectedStation.pollutants.pm25} μg/m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PM10:</span>
                            <span>{selectedStation.pollutants.pm10} μg/m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span>O3:</span>
                            <span>{selectedStation.pollutants.o3} μg/m³</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </GoogleMapsWrapper>

            {/* Legend */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-3 shadow-lg">
              <div className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                AQI Scale
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  <span>Good (0-50)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                  <span>Moderate (51-100)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
                  <span>Unhealthy (101-150)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                  <span>Very Unhealthy (151-200)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Monitoring Stations
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Current readings from all stations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {mapData.map((station) => (
              <div
                key={station.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => handleMarkerClick(station)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full`}
                    style={{ backgroundColor: getAQIColor(station.aqi) }}
                  ></div>
                  <div>
                    <div className="font-medium text-sm sm:text-base">
                      {station.location}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {station.status}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-2xl font-bold text-primary">
                    {station.aqi}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    AQI
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
