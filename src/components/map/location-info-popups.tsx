"use client";

import { X, MapPin, Wifi, Building, Globe, Phone } from "lucide-react";
import { LocationData } from "@/lib/types";
import Popup from "./map-popup";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface LocationInfoPopupProps {
  location: LocationData;
  onClose: () => void;
}

export function LocationInfoPopup({
  location,
  onClose,
}: LocationInfoPopupProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-300",
      inactive: "bg-red-100 text-red-800 border-red-300",
      maintenance: "bg-yellow-100 text-yellow-800 border-yellow-300",
    };

    return (
      <Badge
        variant="outline"
        className={
          variants[status as keyof typeof variants] ||
          "bg-gray-100 text-gray-800 border-gray-300"
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Popup
      latitude={location.latitude}
      longitude={location.longitude}
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
    >
      <div className="w-80 max-w-sm bg-background border rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="bg-primary/10 p-2 rounded-full shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate">
                {location.locationName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(location.status)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex flex-row gap-3 justify-between">
            <div className="min-w-0 text-wrap max-w-40">
              <span className="text-muted-foreground text-xs font-medium block mb-1">
                OPD Pengampu
              </span>
              <p
                className="font-medium text-sm text-wrap"
                title={location.opdPengampu}
              >
                {location.opdPengampu}
              </p>
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground text-xs font-medium block mb-1">
                Type
              </span>
              <p className="font-medium text-sm truncate">{location.opdType}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-muted-foreground text-xs font-medium">
                  ISP Provider
                </span>
                <p className="font-medium text-sm">{location.ispName}</p>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-xs font-medium">
                  Speed
                </span>
                <p className="font-medium text-sm">{location.internetSpeed}</p>
              </div>
            </div>

            <div className="flex flex-row gap-3 justify-between">
              <div>
                <span className="text-muted-foreground text-xs font-medium block mb-1">
                  Ratio
                </span>
                <p className="font-medium text-sm">{location.internetRatio}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs font-medium block mb-1">
                  Infrastructure
                </span>
                <p className="font-medium text-sm">
                  {location.internetInfrastructure}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-muted-foreground text-xs font-medium block mb-1">
                JIP
              </span>
              <p className="font-medium text-sm">{location.jip}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs font-medium block mb-1">
                Drop Point
              </span>
              <p className="font-medium text-sm">{location.dropPoint}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs font-medium block mb-1">
                Category
              </span>
              <p className="font-medium text-sm">{location.eCat}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <div className="flex flex-row justify-between text-xs text-muted-foreground">
            <p className="font-mono text-wrap max-w-40">ID: {location.id}</p>
            <div className="flex flex-col font-mono justify-end self-end">
              <p className="">Koordinat:</p>
              <p>{location.latitude}</p>
              <p>{location.longitude}</p>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
