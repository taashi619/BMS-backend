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

exports.getAllStudents = async (query) => {
  const { withFinesOnly, search } = query;

  const whereStudent =
    withFinesOnly === "true"
      ? { totalFines: { gt: 0 } }
      : {};

  const whereUser = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const students = await prisma.student.findMany({
    where: {
      ...whereStudent,
      user: whereUser,
    },
    include: { user: true },
    orderBy: {
      totalFines: "desc",
    },
  });

  return students.map((s) => ({
    id: s.id,
    studentId: s.indexNo,
    firstName: s.user.firstName,
    lastName: s.user.lastName,
    email: s.user.email,
    totalFines: s.totalFines, // Decimal -> string in JSON
    isResidential: s.isResidential,
  }));
};
