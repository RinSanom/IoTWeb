const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Testing database connection...");

  try {
    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    // Test creating a sample air quality record
    const sampleData = await prisma.airQuality.create({
      data: {
        aqiCategory: "Good",
        pm10: 25.5,
        pm2_5: 12.3,
        no2: 8.7,
        o3: 45.2,
        co: 0.8,
        so2: 2.1,
        nh3: 1.5,
        pb: 0.02,
      },
    });

    console.log("✅ Sample data created:", sampleData);

    // Fetch the data back
    const allRecords = await prisma.airQuality.findMany();
    console.log("📊 All air quality records:", allRecords);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Database disconnected");
  }
}

main().catch(console.error);
