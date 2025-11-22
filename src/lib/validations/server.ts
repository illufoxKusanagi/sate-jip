import { z } from "zod";

/**
 * Server Data Validation Schema
 */
export const serverSchema = z.object({
  rackName: z.enum(["Rak A", "Rak B", "Rak C", "Rak D"], {
    message: "Invalid rack name",
  }),
  unitPosition: z
    .number()
    .int("Unit position must be an integer")
    .min(1, "Unit position must be at least 1")
    .max(42, "Unit position cannot exceed 42"),
  unitSize: z
    .number()
    .int("Unit size must be an integer")
    .min(1, "Unit size must be at least 1U")
    .max(4, "Unit size cannot exceed 4U"),
  serverName: z
    .string()
    .min(1, "Server name is required")
    .max(255, "Server name cannot exceed 255 characters"),
  brand: z.string().max(50, "Brand cannot exceed 50 characters").default(""),
  assetNumber: z
    .string()
    .min(1, "Asset number is required")
    .max(50, "Asset number cannot exceed 50 characters"),
  serialNumber: z
    .string()
    .max(50, "Serial number cannot exceed 50 characters")
    .optional(),
  ipAddress: z
    .string()
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "Invalid IP address format"
    )
    .or(z.literal(""))
    .optional(),
  status: z.enum(["online", "offline", "maintenance", "standby"], {
    message: "Invalid status",
  }),
  specification: z.string().nullable().optional(),
  installedApps: z.array(z.string()).default([]),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").default(""),
});

/**
 * Partial schema for updating server (all fields optional)
 */
export const updateServerSchema = serverSchema.partial();

/**
 * Server Info Schema (for display/read operations)
 */
export type ServerData = z.infer<typeof serverSchema>;

/**
 * Schema for checking duplicate server in same rack/unit
 */
export const serverPositionSchema = z.object({
  rackName: z.string(),
  unitPosition: z.number(),
  unitSize: z.number(),
});
