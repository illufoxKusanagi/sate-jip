import { z } from "zod";

/**
 * Location Data Validation Schema
 */
export const locationSchema = z.object({
  locationName: z
    .string()
    .min(1, "Location name is required")
    .max(255, "Location name cannot exceed 255 characters"),
  activationDate: z.string().min(1, "Activation date is required"),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .or(z.string()),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .or(z.string()),
  opdPengampu: z
    .string()
    .min(1, "OPD Pengampu is required")
    .max(255, "OPD Pengampu cannot exceed 255 characters"),
  opdType: z.enum(["OPD Utama", "OPD Pendukung", "Publik", "Non OPD"], {
    errorMap: () => ({ message: "Invalid OPD type" }),
  }),
  ispName: z
    .string()
    .min(1, "ISP name is required")
    .max(255, "ISP name cannot exceed 255 characters"),
  internetSpeed: z
    .number()
    .positive("Internet speed must be positive")
    .or(z.string()),
  internetRatio: z
    .string()
    .min(1, "Internet ratio is required")
    .max(50, "Internet ratio cannot exceed 50 characters"),
  internetInfrastructure: z.enum(["KABEL", "WIRELESS"], {
    errorMap: () => ({ message: "Invalid infrastructure type" }),
  }),
  jip: z.enum(["checked", "unchecked"], {
    errorMap: () => ({ message: "Invalid JIP value" }),
  }),
  dropPoint: z
    .string()
    .max(255, "Drop point cannot exceed 255 characters")
    .optional(),
  eCat: z.string().max(255, "eCat cannot exceed 255 characters").optional(),
  status: z.enum(["active", "inactive", "maintenance"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
});

/**
 * Partial schema for updating location (all fields optional)
 */
export const updateLocationSchema = locationSchema.partial();

/**
 * Location Info Schema (for display/read operations)
 */
export type LocationData = z.infer<typeof locationSchema>;
