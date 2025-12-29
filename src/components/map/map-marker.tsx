"use client";

import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { ReactNode, useEffect, useRef } from "react";
import { useMap } from "@/app/context/map-context";

type Props<T = any> = {
  longitude: number;
  latitude: number;
  data: T;
  onHover?: ({
    isHovered,
    position,
    marker,
    data,
  }: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: T;
  }) => void;
  onClick?: ({
    position,
    marker,
    data,
  }: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: T;
  }) => void;
  children?: ReactNode;
} & MarkerOptions;

export default function Marker<T = any>({
  children,
  latitude,
  longitude,
  data,
  onHover,
  onClick,
  ...props
}: Props<T>) {
  const { map } = useMap();
  const markerRef = useRef<HTMLDivElement | null>(null);

  let marker: mapboxgl.Marker | null = null;
  const handleHover = (isHovered: boolean) => {
    if (onHover && marker) {
      onHover({
        isHovered,
        position: { longitude, latitude },
        marker,
        data,
      });
    }
  };
  const handleClick = () => {
    if (onClick && marker) {
      onClick({
        position: { longitude, latitude },
        marker,
        data,
      });
    }
  };

  useEffect(() => {
    const markerEl = markerRef.current;
    if (!map || !markerEl) return;
    const handleMouseEnter = () => handleHover(true);
    const handleMouseLeave = () => handleHover(false);

    markerEl.addEventListener("mouseenter", handleMouseEnter);
    markerEl.addEventListener("mouseleave", handleMouseLeave);
    markerEl.addEventListener("click", handleClick);

    const options = {
      element: markerEl,
      ...props,
    };
    marker = new mapboxgl.Marker(options)
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      if (marker) marker.remove();
      if (markerEl) {
        markerEl.removeEventListener("mouseenter", handleMouseEnter);
        markerEl.removeEventListener("mouseleave", handleMouseLeave);
        markerEl.removeEventListener("click", handleClick);
      }
    };
  }, [map, longitude, latitude, props]);
  return (
    <>
      <div ref={markerRef}>{children}</div>
    </>
  );
}
