const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Student reports a maintenance issue
 */
exports.reportMaintenanceIssue = async (user, { bicycleId, description, photoUrl }) => {
  if (user.role !== 'STUDENT') {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }

  // Validate bicycle exists
  const bicycle = await prisma.bicycle.findUnique({ where: { id: bicycleId } });
  if (!bicycle) {
    const error = new Error('Bicycle not found');
    error.status = 404;
    throw error;
  }

  // Create maintenance issue
  const issue = await prisma.maintenance.create({
    data: {
      bicycleId,
      userId: user.userId,
      description,
      status:"OPEN",
      photoUrl,
    },
  });

  return issue;
};

/**
 * Admin fetches all pending maintenance issues
 */
exports.getMaintenanceQueue = async (adminUser) => {
  if (adminUser.role !== 'ADMIN') {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }

  return prisma.maintenance.findMany({
    include: { user: true, bicycle: true },
    orderBy: { reportedDate: 'desc' },
  });
};

exports.updateMaintenanceStatus = async (
  adminUser,
  maintenanceId,
  newStatus
) => {

  if (adminUser.role !== 'ADMIN') {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }

  const maintenance = await prisma.maintenance.findUnique({
    where: { id: Number(maintenanceId) },
  });

  if (!maintenance) {
    const error = new Error('Maintenance record not found');
    error.status = 404;
    throw error;
  }

  // 🔄 Update status
  return prisma.maintenance.update({
    where: { id: Number(maintenanceId) },
    data: {
      status: newStatus,
      resolvedBy:
        newStatus === 'RESOLVED' ? adminUser.id : null,
    },
  });
};
exports.getMyMaintenanceHistory = async (user) => {
  if (user.role !== "STUDENT") {
    const error = new Error("Access denied");
    error.status = 403;
    throw error;
  }

  const issues = await prisma.maintenance.findMany({
    where: { userId: user.userId },
    include: {
      bicycle: true, // so they see which bike each record is for
      admin: true,   // who resolved it (if any)
    },
    orderBy: {
      reportedDate: "desc",
    },
  });

  return issues;
};