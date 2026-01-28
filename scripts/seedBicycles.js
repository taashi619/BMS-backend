const { PrismaClient,BicycleStatus } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedBicycles() {
  const bicycles = [
    {
      bicycleNumber: "B001",
      status: BicycleStatus.AVAILABLE,
      isActive: true
    },
    {
      bicycleNumber: "B002",
      status: BicycleStatus.AVAILABLE,
      isActive: true
    },
    {
      bicycleNumber: "B003",
      status: BicycleStatus.AVAILABLE,
      isActive: true
    },
    {
      bicycleNumber: "B004", 
      status: BicycleStatus.UNDER_MAINTENANCE,
      isActive: true,
      lastMaintenanceDate: new Date("2025-01-10")
    },
    {
      bicycleNumber: "B005",
      status: BicycleStatus.AVAILABLE,
      isActive: true
    }
  ];

  for (const bike of bicycles) {
    await prisma.bicycle.upsert({
      where: { bicycleNumber: bike.bicycleNumber },
      update: {},
      create: bike
    });
  }

  console.log("✅ Bicycles seeded successfully");
}

seedBicycles()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
