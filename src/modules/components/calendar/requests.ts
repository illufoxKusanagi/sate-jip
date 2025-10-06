import { ConfigData } from "@/lib/types";
import { useState } from "react";

export const getEvents = async () => {
  const response = await fetch("/api/event");
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
};

export const getUsers = async () => {
  return [];
  // return USERS_MOCK;
};
