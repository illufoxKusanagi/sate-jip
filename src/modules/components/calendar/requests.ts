import type { IEvent } from "@/modules/components/calendar/interfaces";

export const getEvents = async (): Promise<IEvent[]> => {
  const response = await fetch("/api/event");
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
};

export const getUsers = async () => {
  return [];
};
