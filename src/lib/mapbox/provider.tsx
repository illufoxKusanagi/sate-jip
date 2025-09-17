"use client";

import { MapContext } from "@/app/context/map-context";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

// Ensure the access token is set
if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
}

type MapComponentProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  children?: React.ReactNode;
};

export default function MapProvider({
  mapContainerRef,
  initialViewState,
  children,
}: MapComponentProps) {
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in Strict Mode
    if (
      initialized.current ||
      !mapContainerRef.current ||
      !process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    ) {
      return;
    }

    initialized.current = true;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12", // FIXED: Use proper Mapbox style URL
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        attributionControl: false,
        logoPosition: "bottom-right",
      });

      map.current.on("load", () => {
        setLoaded(true);
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e);
      });
    } catch (error) {
      console.error("Failed to initialize map:", error);
      initialized.current = false;
    }

    return () => {
      if (map.current) {
        try {
          map.current.remove();
        } catch (error) {
          console.warn("Error removing map:", error);
        }
        map.current = null;
      }
      initialized.current = false;
    };
  }, []); // Remove dependencies to prevent re-initialization

  return (
    <div className="relative w-full h-full">
      <MapContext.Provider value={{ map: map.current }}>
        {loaded && children}
      </MapContext.Provider>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="text-lg font-medium">Loading map...</div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { MapContext } from "@/app/context/map-context";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import { useEffect, useRef, useState } from "react";

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// type MapComponentProps = {
//   mapContainerRef: React.RefObject<HTMLDivElement | null>;
//   initialViewState: {
//     longitude: number;
//     latitude: number;
//     zoom: number;
//   };
//   children?: React.ReactNode;
// };

// export default function MapProvider({
//   mapContainerRef,
//   initialViewState,
//   children,
// }: MapComponentProps) {
//   const map = useRef<mapboxgl.Map | null>(null);
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     if (!mapContainerRef.current) return;
//     map.current = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       style: "mapbox://styles/mapbox/streets-v12", // FIXED: Use proper Mapbox style URL
//       center: [initialViewState.longitude, initialViewState.latitude],
//       zoom: initialViewState.zoom,
//       attributionControl: false,
//       logoPosition: "bottom-right",
//     });
//     map.current.on("load", () => {
//       setLoaded(true);
//     });
//     return () => {
//       if (map.current) {
//         map.current.remove();
//         map.current = null;
//       }
//     };
//   }, [initialViewState, mapContainerRef]);
//   return (
//     <div>
//       <MapContext.Provider value={{ map: map.current }}>
//         {children}
//       </MapContext.Provider>
//       {!loaded && (
//         <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[1000]">
//           <div className="text-lg font-medium">Loading map...</div>
//         </div>
//       )}
//     </div>
//   );
// }
