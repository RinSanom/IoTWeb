"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import React, { useEffect, useRef, useState } from "react";

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  children?: React.ReactNode;
  className?: string;
  onMapLoad?: (map: google.maps.Map) => void;
}

interface MarkerProps {
  position: google.maps.LatLngLiteral;
  title?: string;
  icon?: string | google.maps.Icon | google.maps.Symbol;
  onClick?: () => void;
  map?: google.maps.Map;
}

// Type guard to check if google is available
const isGoogleLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         !!(window as unknown as { google: typeof google }).google && 
         !!(window as unknown as { google: typeof google }).google.maps;
};

// Map Component
export function Map({
  center,
  zoom,
  children,
  className,
  onMapLoad,
}: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map && isGoogleLoaded()) {
      const googleMaps = (window as unknown as { google: typeof google }).google.maps;
      const newMap = new googleMaps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ weight: "2.00" }],
          },
          {
            featureType: "all",
            elementType: "geometry.stroke",
            stylers: [{ color: "#9c9c9c" }],
          },
          {
            featureType: "all",
            elementType: "labels.text",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [{ color: "#f2f2f2" }],
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [{ saturation: -100 }, { lightness: 45 }],
          },
          {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{ visibility: "simplified" }],
          },
          {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [{ color: "#46bcec" }, { visibility: "on" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: googleMaps.ControlPosition.RIGHT_BOTTOM,
        },
      });
      setMap(newMap);
      onMapLoad?.(newMap);
    }
  }, [ref, map, center, zoom, onMapLoad]);

  return (
    <div ref={ref} className={className}>
      {children &&
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { map } as Record<string, unknown>);
          }
        })}
    </div>
  );
}

// Marker Component
export function Marker({ position, title, icon, onClick, map }: MarkerProps) {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker && map && isGoogleLoaded()) {
      const googleMaps = (window as unknown as { google: typeof google }).google.maps;
      const newMarker = new googleMaps.Marker({
        position,
        map,
        title,
        icon,
      });

      if (onClick) {
        newMarker.addListener("click", onClick);
      }

      setMarker(newMarker);
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker, map, position, title, icon, onClick]);

  useEffect(() => {
    if (marker) {
      marker.setOptions({ position, title, icon });
    }
  }, [marker, position, title, icon]);

  return null;
}

// Info Window Component
export function InfoWindow({
  position,
  children,
  map,
  onCloseClick,
}: {
  position: google.maps.LatLngLiteral;
  children: React.ReactNode;
  map?: google.maps.Map;
  onCloseClick?: () => void;
}) {
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();

  useEffect(() => {
    if (!infoWindow && map && isGoogleLoaded()) {
      const googleMaps = (window as unknown as { google: typeof google }).google.maps;
      const newInfoWindow = new googleMaps.InfoWindow({
        position,
      });

      if (onCloseClick) {
        newInfoWindow.addListener("closeclick", onCloseClick);
      }

      setInfoWindow(newInfoWindow);
    }

    return () => {
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [infoWindow, map, position, onCloseClick]);

  useEffect(() => {
    if (infoWindow) {
      const contentString = `<div>${children}</div>`;
      infoWindow.setContent(contentString);
      infoWindow.open(map);
    }
  }, [infoWindow, children, map]);

  return null;
}

// Render function for the wrapper
const render = (status: Status): React.ReactElement => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          <p>Error loading Google Maps</p>
        </div>
      );
    case Status.SUCCESS:
    default:
      return <></>;
  }
};

// Google Maps Wrapper Component
export function GoogleMapsWrapper({
  apiKey,
  children,
}: {
  apiKey: string;
  children: React.ReactNode;
}) {
  return (
    <Wrapper apiKey={apiKey} render={render} libraries={["places"]}>
      {children}
    </Wrapper>
  );
}

export default Map;
