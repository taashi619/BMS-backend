const prisma = require("../config/db");

exports.getAvailableBicycles = async () => {
  return prisma.bicycle.findMany({
    where: {
      isActive: true,
      status: "AVAILABLE",
    },
  });
};

exports.getAllBicycles = async (user) => {
  if (user.role !== "ADMIN") {
    const error = new Error("Access denied");
    error.status = 403;
    throw error;
  }

  return prisma.bicycle.findMany({
    include: {
      booking: true, // optional: see who booked it
    },
  });
};
