// scripts/migrate-data.ts
import { db } from "../src/lib/db/connection";
import { locations, admins } from "../src/lib/db/schema";
import { locationData } from "../src/lib/data/locations";
import { adminData } from "../src/lib/data/admins";

async function migrateData() {
  try {
    console.log("Starting data migration with Drizzle...");

    // Migrate locations
    console.log("Migrating locations...");
    for (const location of locationData) {
      await db
        .insert(locations)
        .values({
          id: location.id,
          locationName: location.locationName,
          latitude: location.latitude?.toString(),
          longitude: location.longitude?.toString(),
          opdPengampu: location.opdPengampu,
          opdType: location.opdType as any,
          ispName: location.ispName,
          internetSpeed: location.internetSpeed,
          internetRatio: location.internetRatio,
          internetInfrastructure: location.internetInfrastructure as any,
          jip: location.jip as any,
          dropPoint: location.dropPoint,
          eCat: location.eCat,
          status: location.status as any,
        })
        .onDuplicateKeyUpdate({
          locationName: location.locationName,
          latitude: location.latitude?.toString(),
          longitude: location.longitude?.toString(),
        });
    }

    // Migrate admins
    console.log("Migrating admins...");
    for (const admin of adminData) {
      await db
        .insert(admins)
        .values({
          id: admin.id,
          nama: admin.nama,
          nip: admin.nip,
          jabatan: admin.jabatan,
          instansi: admin.instansi,
          whatsapp: admin.whatsapp,
        })
        .onDuplicateKeyUpdate({
          nama: admin.nama,
          jabatan: admin.jabatan,
        });
    }

    console.log("Data migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateData();
