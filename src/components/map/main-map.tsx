"use client";

import { useEffect, useRef, useState } from "react";
import MapProvider from "@/lib/mapbox/provider";
import MapSearch from "./map-search";
import MapControls from "./map-control";
import MapStyles from "./map-styles";
import { CustomPin } from "./custom-pins";
import { LocationData } from "@/lib/types";
import { LocationInfoPopup } from "./location-info-popups";
import React from "react";

export default function MainMap() {
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("/api/locations");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setLocationData(data);
        } else {
          console.error("Received data is not an array:", data);
          setLocationData([]);
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocationData([]);
        setError(
          error instanceof Error ? error.message : "Failed to fetch locations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [hoveredLocation, setHoveredLocation] = useState<LocationData | null>(
    null
  );

  const initialViewState = {
    longitude: 111.4,
    latitude: -7.5,
    zoom: 9,
  };

  const handlePinClick = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const handlePinHover = (location: LocationData | null) => {
    setHoveredLocation(location);
  };

  const handleClosePopup = () => {
    setSelectedLocation(null);
  };

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      className="inset-0 h-full w-full rounded-2xl"
    >
      <MapProvider
        mapContainerRef={mapContainerRef}
        initialViewState={initialViewState}
      >
        <MapSearch />
        <MapControls />
        <MapStyles />

        {error && (
          <div className="absolute top-20 left-4 bg-red-500 text-white p-2 rounded">
            Error: {error}
          </div>
        )}

        {Array.isArray(locationData) &&
          locationData.length > 0 &&
          locationData.map((location) => (
            <CustomPin
              key={location.id}
              location={location}
              onHover={handlePinHover}
              onClick={handlePinClick}
            />
          ))}

        {Array.isArray(locationData) &&
          locationData.length === 0 &&
          !loading && (
            <div className="absolute top-20 left-4 bg-blue-500 text-white p-2 rounded">
              No locations found
            </div>
          )}

        {selectedLocation && (
          <LocationInfoPopup
            location={selectedLocation}
            onClose={handleClosePopup}
          />
        )}
      </MapProvider>
    </div>
  );
}
