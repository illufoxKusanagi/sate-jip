import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  opdName: z.string().min(1, "Opd Name is required"),
  startDate: z.date().min(1, {
    message: "Start date is required",
  }),

  //TODO : Consider using required_error or check zod docs
  endDate: z.date().min(1, {
    message: "End date is required",
  }),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"], {
    message: "Variant is required",
  }),
});

export type TEventFormData = z.infer<typeof eventSchema>;
