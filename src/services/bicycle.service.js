const prisma = require("../config/db");

exports.getAvailableBicycles = async () => {
  return prisma.bicycle.findMany({
    where: {
      isActive: true,
      status: "AVAILABLE",
    },
  });
};

function adminOnly(user) {
  if (user.role !== "ADMIN") {
    const error = new Error("Admin access only");
    error.status = 403;
    throw error;
  }
}

exports.createBicycle = async (user, data) => {
  adminOnly(user);

  return prisma.bicycle.create({
    data: {
      bicycleNumber: data.bicycleNumber,
    },
  });
};

exports.getAllBicycles = async (user) => {
  adminOnly(user);

  return prisma.bicycle.findMany({
    include:{bookings: true},
    orderBy: { id: "desc" },
  });
};

exports.updateBicycle = async (user, id, data) => {
  adminOnly(user);

  return prisma.bicycle.update({
    where: { id: Number(id) },
    data: {
      bicycleNumber: data.bicycleNumber,
      lastMaintenanceDate: data.lastMaintenanceDate,
    },
  });
};

exports.updateBicycleStatus = async (user, id, status) => {
  adminOnly(user);

  return prisma.bicycle.update({
    where: { id: Number(id) },
    data: {
      status,
    },
  });
};

exports.deactivateBicycle = async (user, id) => {
  adminOnly(user);

  return prisma.bicycle.update({
    where: { id: Number(id) },
    data: {
      isActive: false,
    },
  });
};
