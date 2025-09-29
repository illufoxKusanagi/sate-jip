// scripts/seed-admins.ts
import { db } from "../src/lib/db/connection";
import { admins, locations, users } from "../src/lib/db/schema";
import { adminData } from "../src/lib/data/admins";
import { locationData } from "../src/lib/data/locations";
import bcrypt from "bcryptjs";
import { adminUser } from "@/lib/data/users";

async function seedUsers() {
  try {
    console.log("🔐 Starting user data seeding...");

    // Clear existing user data
    console.log("🗑️ Clearing existing user data...");
    await db.delete(users);

    // Insert user data with hashed passwords
    console.log("👤 Inserting user data...");
    for (const user of adminUser) {
      // Hash the password
      const saltRounds = 12; // Higher is more secure but slower
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      await db.insert(users).values({
        username: user.username,
        password: hashedPassword,
      });

      console.log(`✅ Created user: ${user.username}`);
    }

    console.log(`✅ Successfully seeded ${adminUser.length} users`);
  } catch (error) {
    console.error("❌ User seeding failed:", error);
    throw error;
  }
}

async function seedAdmins() {
  try {
    console.log("🌱 Starting admin data seeding...");

    // Clear existing admin data
    console.log("🗑️ Clearing existing admin data...");
    await db.delete(admins);

    // Insert admin data
    console.log("👥 Inserting admin data...");
    for (const admin of adminData) {
      await db.insert(admins).values({
        // id: admin.id,
        nama: admin.nama,
        nip: admin.nip || "",
        jabatan: admin.jabatan,
        instansi: admin.instansi,
        whatsapp: admin.whatsapp,
      });
    }

    console.log(`✅ Successfully seeded ${adminData.length} admins`);
  } catch (error) {
    console.error("❌ Admin seeding failed:", error);
    throw error;
  }
}

async function seedLocations() {
  try {
    console.log("🌱 Starting location data seeding...");

    // Clear existing location data
    console.log("🗑️ Clearing existing location data...");
    await db.delete(locations);

    // Insert location data
    console.log("📍 Inserting location data...");
    for (const location of locationData) {
      await db.insert(locations).values({
        locationName: location.locationName,
        latitude: location.latitude?.toString() || null,
        longitude: location.longitude?.toString() || null,
        opdPengampu: location.opdPengampu,
        opdType: location.opdType as any,
        ispName: location.ispName,
        internetSpeed: location.internetSpeed,
        internetRatio: location.internetRatio,
        internetInfrastructure: location.internetInfrastructure as any,
        jip: location.jip as any,
        dropPoint: location.dropPoint || "",
        eCat: location.eCat,
        status: location.status as any,
      });
    }

    console.log(`✅ Successfully seeded ${locationData.length} locations`);
  } catch (error) {
    console.error("❌ Location seeding failed:", error);
    throw error;
  }
}

async function seedAll() {
  try {
    await seedAdmins();
    await seedLocations();
    await seedUsers();
    console.log("🎉 All data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  }
}

// Run seeding
seedAll();
