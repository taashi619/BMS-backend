const prisma = require("../config/db");

exports.getProfile = async (user) => {
  // STUDENT PROFILE
  if (user.role === "STUDENT") {
    return prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        student: {
          select: {
            indexNo: true,
            faculty: true,
            roomNumber: true,
            isResidential: true,
          },
        },
      },
    });
  }

  // ADMIN PROFILE
  if (user.role === "ADMIN") {
    return prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
  }

  const error = new Error("Invalid role");
  error.status = 400;
  throw error;
};

exports.updateProfile = async (user, updates) => {
  const {
    firstName,
    lastName,
    email,
    faculty,
    roomNumber,
  } = updates;

  // STUDENT UPDATE
  if (user.role === "STUDENT") {
    return prisma.user.update({
      where: { id: user.userId },
      data: {
        firstName,
        lastName,
        email,
        student: {
          update: {
            faculty,
            roomNumber,
          },
        },
      },
      include: {
        student: true,
      },
    });
  }

  // ADMIN UPDATE
  if (user.role === "ADMIN") {
    return prisma.user.update({
      where: { id: user.userId },
      data: {
        firstName,
        lastName,
        email,
      },
    });
  }

  const error = new Error("Invalid role");
  error.status = 400;
  throw error;
};
