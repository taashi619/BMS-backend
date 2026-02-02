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

  return prisma.maintenanceIssue.findMany({
    where: { status: 'PENDING' },
    include: { user: true, bicycle: true },
    orderBy: { createdAt: 'desc' },
  });
};
