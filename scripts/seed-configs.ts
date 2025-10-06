import { db } from "@/lib/db/connection";
import { dataConfig } from "@/lib/db/schema";
import { inputConfig } from "@/lib/data/configs";
import { v4 as uuidv4 } from "uuid";

async function seedConfigs() {
  try {
    console.log("🌱 Seeding configuration data...");

    // Clear existing data
    await db.delete(dataConfig);
    console.log("🗑️ Cleared existing configurations");

    // Insert sample data
    for (const config of inputConfig) {
      await db.insert(dataConfig).values({
        id: uuidv4(),
        dataType: config.type,
        dataConfig: config.dataConfig,
      });
    }

    console.log(`✅ Seeded ${inputConfig.length} configurations successfully!`);
  } catch (error) {
    console.error("❌ Error seeding configs:", error);
  } finally {
    process.exit(0);
  }
}

seedConfigs();
