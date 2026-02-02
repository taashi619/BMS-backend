const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createComplaint = async (user, description, photoUrl) => {
  if (user.role !== "STUDENT") {
    throw Object.assign(new Error("Only students can create complaints"), {
      status: 403,
    });
  }

  return prisma.complaint.create({
    data: {
      userId: user.userId,
      description,
      status:"NEW",
      photoUrl,
    },
  });
};

exports.getAllComplaints = async (admin) => {
  if (admin.role !== "ADMIN") {
    throw Object.assign(new Error("Access denied"), { status: 403 });
  }

  return prisma.complaint.findMany({
    include: {
      user: true,
      admin: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.updateComplaintStatus = async (admin, complaintId, status) => {
  if (admin.role !== "ADMIN") {
    throw Object.assign(new Error("Access denied"), { status: 403 });
  }

  return prisma.complaint.update({
    where: { id: complaintId },
    data: {
      status,
      adminId: admin.id,
    },
  });
};
