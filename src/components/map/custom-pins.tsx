"use client";

import { Wifi, WifiOff, Wrench, MapPin } from "lucide-react";
import { LocationData } from "@/lib/types";
import Marker from "./map-marker";

interface CustomPinProps {
  location: LocationData;
  onHover?: (data: LocationData | null) => void;
  onClick?: (data: LocationData) => void;
}

export function CustomPin({ location, onHover, onClick }: CustomPinProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600 border-green-600";
      case "inactive":
        return "bg-red-500 hover:bg-red-600 border-red-600";
      case "maintenance":
        return "bg-yellow-500 hover:bg-yellow-600 border-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600 border-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Wifi className="stroke-[2.5px] size-4" />;
      case "inactive":
        return <WifiOff className="stroke-[2.5px] size-4" />;
      case "maintenance":
        return <Wrench className="stroke-[2.5px] size-4" />;
      default:
        return <MapPin className="stroke-[2.5px] size-4" />;
    }
  };

  return (
    <Marker
      longitude={location.longitude}
      latitude={location.latitude}
      data={location}
      onHover={({ isHovered, data }) => {
        if (onHover) {
          onHover(isHovered ? data : null);
        }
      }}
      onClick={({ data }) => {
        if (onClick) {
          onClick(data);
        }
      }}
    >
      <div
        className={`rounded-full flex items-center justify-center transform transition-all duration-200 text-white shadow-lg border-2 size-12 cursor-pointer hover:scale-110 ${getStatusColor(
          location.status
        )}`}
        title={`${location.locationName} - ${location.status}`}
      >
        {getStatusIcon(location.status)}
      </div>
    </Marker>
  );
}
