import { z } from "zod";

/**
 * Admin Data Validation Schema
 */
export const adminSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama is required")
    .max(255, "Nama cannot exceed 255 characters"),
  nip: z
    .string()
    .min(1, "NIP is required")
    .max(50, "NIP cannot exceed 50 characters")
    .regex(/^[0-9]+$/, "NIP must contain only numbers"),
  jabatan: z
    .string()
    .min(1, "Jabatan is required")
    .max(255, "Jabatan cannot exceed 255 characters"),
  instansi: z
    .string()
    .min(1, "Instansi is required")
    .max(255, "Instansi cannot exceed 255 characters"),
  whatsapp: z
    .string()
    .min(1, "WhatsApp number is required")
    .regex(
      /^(\+62|62|0)[0-9]{9,12}$/,
      "Invalid WhatsApp number format. Use format: 08xxxxxxxxxx or +628xxxxxxxxxx"
    ),
});

/**
 * Partial schema for updating admin (all fields optional)
 */
export const updateAdminSchema = adminSchema.partial();

/**
 * Admin Info Schema (for display/read operations)
 */
export type AdminData = z.infer<typeof adminSchema>;
