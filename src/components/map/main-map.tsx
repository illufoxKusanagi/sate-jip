"use client";

import { useRef, useState } from "react";
import MapProvider from "@/lib/mapbox/provider";
import MapSearch from "./map-search";
import MapControls from "./map-control";
import MapStyles from "./map-styles";
import { CustomPin } from "./custom-pins";
// import { locationData } from "@/lib/data/locations";
import { LocationData } from "@/lib/types";
import { LocationInfoPopup } from "./location-info-popups";
import React from "react";

export default function MainMap() {
  const [locationData, setLocationData] = React.useState<LocationData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch admin data from API
  React.useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("/api/locations");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setLocationData(data);
        } else {
          console.error("Received data is not an array:", data);
          setLocationData([]); // Fallback to empty array
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocationData([]); // Ensure it's always an array
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

        {/* Show error message if there's an error */}
        {error && (
          <div className="absolute top-20 left-4 bg-red-500 text-white p-2 rounded">
            Error: {error}
          </div>
        )}

        {/* Custom Pins - Only render if locationData is an array and has data */}
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

        {/* Show message if no locations */}
        {Array.isArray(locationData) &&
          locationData.length === 0 &&
          !loading && (
            <div className="absolute top-20 left-4 bg-blue-500 text-white p-2 rounded">
              No locations found
            </div>
          )}

        {/* Popup */}
        {selectedLocation && (
          <LocationInfoPopup
            location={selectedLocation}
            onClose={handleClosePopup}
          />
        )}
      </MapProvider>
    </div>
    // <div
    //   id="map-container"
    //   ref={mapContainerRef}
    //   className="inset-0 h-full w-full rounded-2xl"
    // >
    //   <MapProvider
    //     mapContainerRef={mapContainerRef}
    //     initialViewState={initialViewState}
    //   >
    //     <MapSearch />
    //     <MapControls />
    //     <MapStyles />

    //     {/* Custom Pins */}
    //     {locationData.map((location) => (
    //       <CustomPin
    //         key={location.id}
    //         location={location}
    //         onHover={handlePinHover}
    //         onClick={handlePinClick}
    //       />
    //     ))}

    //     {/* Popup */}
    //     {selectedLocation && (
    //       <LocationInfoPopup
    //         location={selectedLocation}
    //         onClose={handleClosePopup}
    //       />
    //     )}
    //   </MapProvider>
    // </div>
  );
}

// "use client";

// import { useRef } from "react";
// import MapProvider from "@/lib/mapbox/provider";
// import MapSearch from "./map-search";
// import { cn } from "@/lib/utils";
// import MapControls from "./map-control";
// import MapStyles from "./map-styles";

// export default function MainMap() {
//   const mapContainerRef = useRef<HTMLDivElement>(null);

//   const initialViewState = {
//     longitude: -122.4194,
//     latitude: 37.7749,
//     zoom: 10,
//   };

//   return (
//     <div
//       id="map-container"
//       ref={mapContainerRef}
//       className="inset-0 h-full w-full rounded-2xl"
//     >
//       <MapProvider
//         mapContainerRef={mapContainerRef}
//         initialViewState={{
//           longitude: -122.4194,
//           latitude: 37.7749,
//           zoom: 10,
//         }}
//       >
//         <MapSearch />
//         <MapControls />
//         <MapStyles />
//       </MapProvider>
//     </div>
//   );
// }

// // "use client";

// // import { useRef } from "react";
// // import MapProvider from "@/lib/mapbox/provider";
// // import MapSearch from "./map-search";

// // export default function MainMap() {
// //   const mapContainerRef = useRef<HTMLDivElement>(null);

// //   const initialViewState = {
// //     longitude: -122.4194,
// //     latitude: 37.7749,
// //     zoom: 10,
// //   };

// //   return (
// //     <div className="relative w-full h-screen">
// //       <div
// //         ref={mapContainerRef}
// //         className="absolute inset-0"
// //         style={{ width: "100%", height: "100%" }}
// //       />
// //       <MapProvider
// //         mapContainerRef={mapContainerRef}
// //         initialViewState={initialViewState}
// //       >
// //         {/* <MapSearch /> */}
// //       </MapProvider>
// //     </div>
// //   );
// // }
