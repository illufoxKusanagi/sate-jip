"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Loader2, MapPin, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import {
  iconMap,
  LocationFeature,
  LocationSuggestion,
} from "@/lib/mapbox/utils";
import { useMap } from "@/app/context/map-context";

export default function MapSearch() {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationFeature | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<LocationFeature[]>(
    []
  );
  const [debouncedQuery] = useDebounce(query, 400); // FIXED: Destructure the returned array

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchLocations = async () => {
      setIsSearching(true);
      setIsOpen(true);

      try {
        const res = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
            debouncedQuery
          )}&access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_TOKEN
          }&session_token=${
            process.env.NEXT_PUBLIC_MAPBOX_SESSION_TOKEN
          }&country=US&limit=5&proximity=-122.4194,37.7749`
        );

        const data = await res.json();
        setResults(data.suggestions ?? []);
      } catch (err) {
        console.error("Geocoding error:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchLocations();
  }, [debouncedQuery]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setDisplayValue(value);
  };

  const handleSelect = async (suggestion: LocationSuggestion) => {
    try {
      setIsSearching(true);

      const res = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&session_token=${process.env.NEXT_PUBLIC_MAPBOX_SESSION_TOKEN}`
      );

      const data = await res.json();
      const featuresData = data?.features;

      if (map && featuresData?.length > 0) {
        const coordinates = featuresData[0]?.geometry?.coordinates;

        map.flyTo({
          center: coordinates,
          zoom: 14,
          speed: 4,
          duration: 1000,
          essential: true,
        });

        setDisplayValue(suggestion.name);
        setSelectedLocations(featuresData);
        setSelectedLocation(featuresData[0]);
        setResults([]);
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Retrieve error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setDisplayValue("");
    setResults([]);
    setIsOpen(false);
    setSelectedLocation(null);
    setSelectedLocations([]);
  };

  return (
    <section className="absolute top-4 left-1/2 sm:left-4 z-10 w-[90vw] sm:w-[350px] -translate-x-1/2 sm:translate-x-0 rounded-lg shadow-lg">
      <Command className="rounded-lg">
        <div
          className={cn(
            "w-full flex items-center justify-between px-3 gap-1",
            isOpen && "border-b"
          )}
        >
          <CommandInput
            placeholder="Search locations..."
            value={displayValue}
            onValueChange={handleInputChange}
            className="flex-1"
          />
          {displayValue && !isSearching && (
            <X
              className="size-4 shrink-0 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={clearSearch}
            />
          )}
          {isSearching && (
            <Loader2 className="size-4 shrink-0 text-primary animate-spin" />
          )}
        </div>

        {isOpen && (
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 p-4">
                {isSearching ? (
                  <Loader2 className="size-4 shrink-0 text-primary animate-spin" />
                ) : (
                  <p className="text-sm font-medium">No locations found</p>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {results.map((location) => (
                <CommandItem
                  key={location.mapbox_id}
                  onSelect={() => handleSelect(location)}
                  value={`${location.name} ${location.place_formatted} ${location.mapbox_id}`}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                    {location.maki && iconMap[location.maki] ? (
                      iconMap[location.maki]
                    ) : (
                      <MapPin className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{location.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[270px]">
                      {location.place_formatted}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </section>
  );
}
