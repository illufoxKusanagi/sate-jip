"use client";

import { useEffect, useState } from "react";
import { CalendarBody } from "@/modules/components/calendar/calendar-body";
import { CalendarProvider } from "@/modules/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/modules/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/modules/components/calendar/header/calendar-header";
import { getEvents } from "@/modules/components/calendar/requests";
import type { IEvent } from "@/modules/components/calendar/interfaces";

export function Calendar() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await getEvents();
        console.log("Fetched events:", data); // Debug
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("Error loading events:", err);
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full border rounded-xl p-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading calendar...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border rounded-xl p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-red-500">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <CalendarProvider events={events} view="bulan">
      <DndProvider showConfirmation={false}>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
