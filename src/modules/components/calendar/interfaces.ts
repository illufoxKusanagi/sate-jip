import type { TEventColor } from "@/modules/components/calendar/types";

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

// export interface IEvent {
//   id: number;
//   user: IUser;
//   startDate: string;
//   endDate: string;
//   title: string;
//   color: TEventColor;
//   description: string;
// }

export interface IEvent {
  id: string;
  opdName: string;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  description: string;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
