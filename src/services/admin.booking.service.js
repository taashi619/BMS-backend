const prisma = require("../config/db");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

exports.issueKey = async (user, bookingId) => {
    // ADMIN only
    if (user.role !== "ADMIN") {
        const error = new Error("Admin only");
        error.status = 403;
        throw error;
    }

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { bicycle: true },
    });

    if (!booking || booking.status !== "BOOKED") {
        const error = new Error("Invalid booking");
        error.status = 400;
        throw error;
    }

    // allowed ride time
    const allowedHours = 12;
    const returnTime = new Date();
    returnTime.setHours(returnTime.getHours() + allowedHours);

    await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: "KEY_TAKEN",
            keyTaken: true,
            returnTime,
        },
    });

    await prisma.bicycle.update({
        where: { id: booking.bicycleId },
        data: { status: "IN_USE" },
    });

    return {
        message: "Key issued. Ride started.",
        returnTime,
    };
};

exports.approveReturn = async (user, bookingId) => {
    if (user.role !== "ADMIN") {
        const error = new Error("Admin only");
        error.status = 403;
        throw error;
    }

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true },
    });

    if (!booking || booking.status !== "RETURN_PENDING") {
        const error = new Error("Return not pending");
        error.status = 400;
        throw error;
    }

    const finePerHour = parseFloat(process.env.FINE_PER_HOUR) || 1;
    const freeHours = parseFloat(process.env.FREE_HOURS) || 12;

    let fine = 0;

    if (booking.actualReturnTime > booking.returnTime) {
        const diffMs = booking.actualReturnTime - booking.returnTime;
        const diffHours = diffMs / (1000 * 60 * 60);

        // Deduct free hours
        const chargeableHours = Math.max(0, diffHours - freeHours);

        fine = Math.round(chargeableHours * finePerHour * 100) / 100;
    }



    await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: "APPROVED_RETURN",
            fineAmount: fine,
        },
    });

    await prisma.bicycle.update({
        where: { id: booking.bicycleId },
        data: { status: "AVAILABLE" },
    });

    await prisma.student.update({
        where: { userId: booking.userId },
        data: {
            totalFines: {
                increment: fine,
            },
        },
    });

    return {
        message: "Return approved",
        fine,
    };
};
exports.createStudentByAdmin = async (adminUser, data) => {
  if (adminUser.role !== "ADMIN") {
    const err = new Error("Only admins can create students");
    err.status = 403;
    throw err;
  }

  const {
    firstName,
    lastName,
    email,
    password,
    indexNo,
    faculty,
    roomNumber,
    phone,
    isResidential,
  } = data;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "STUDENT",
      phone,
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: user.id,
      indexNo,
      faculty,
      roomNumber,
      isResidential,
    },
  });

  return { user, student };
};
exports.getMyTotalFine = async (user) => {
  if (user.role !== "STUDENT") {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  const student = await prisma.student.findUnique({
    where: { userId: user.userId },
    select: { totalFines: true },
  });

  if (!student) {
    const err = new Error("Student profile not found");
    err.status = 404;
    throw err;
  }

  return {
    totalFine: student.totalFines ?? 0,
  };
};