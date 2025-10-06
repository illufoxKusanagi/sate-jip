"use client";

import React, { useEffect, useState } from "react";
import { CalendarBody } from "@/modules/components/calendar/calendar-body";
import { CalendarProvider } from "@/modules/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/modules/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/modules/components/calendar/header/calendar-header";
import { getEvents } from "@/modules/components/calendar/requests";
import type { IEvent } from "@/modules/components/calendar/interfaces";

export function Calendar() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        console.log("Fetched events:", data);
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full border rounded-xl p-8">
        <div className="flex items-center justify-center text-muted-foreground">
          Loading calendar...
        </div>
      </div>
    );
  }

  return (
    <CalendarProvider events={events} view="month">
      <DndProvider showConfirmation={false}>
        <div className="w-full border rounded-xl">
          <CalendarHeader />
          <CalendarBody />
        </div>
      </DndProvider>
    </CalendarProvider>
  );
}
