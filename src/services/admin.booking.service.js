const prisma = require("../config/db");
const bcrypt = require("bcrypt");
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

  // allowed ride time in minutes, from env
  const freeMinutes = Number(process.env.FREE_MINUTES ?? 60); // default 60 min

  const start = new Date(); 
  const returnTime = new Date(start.getTime() + freeMinutes * 60 * 1000);

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

  if (!booking.actualReturnTime || !booking.returnTime) {
    const error = new Error("Missing return times");
    error.status = 400;
    throw error;
  }

  const finePerMinute = Number(process.env.FINE_PER_MINUTE ?? 0.1);
  const freeMinutes = Number(process.env.FREE_MINUTES ?? 1);

  const actual = new Date(booking.actualReturnTime);
  const planned = new Date(booking.returnTime);

  const diffMs = actual.getTime() - planned.getTime();
  const diffMinutes = diffMs / (1000 * 60);

  const chargeableMinutes = Math.max(0, diffMinutes - freeMinutes);
  let fine = 0;

  if (chargeableMinutes > 0) {
    fine = Math.round(chargeableMinutes * finePerMinute * 100) / 100;
  }

  console.log({
    actualReturnTime: booking.actualReturnTime,
    returnTime: booking.returnTime,
    diffMinutes,
    chargeableMinutes,
    finePerMinute,
    freeMinutes,
    fine,
  });

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

exports.rejectBooking = async (user, bookingId) => {
  if (user.role !== "ADMIN") {
    const error = new Error("Admin only");
    error.status = 403;
    throw error;
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== "BOOKED") {
    const error = new Error("Only pending bookings can be rejected");
    error.status = 400;
    throw error;
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
    },
  });

  await prisma.bicycle.update({
    where: { id: booking.bicycleId },
    data: { status: "AVAILABLE" },
  });


  return { message: "Booking rejected" };
};

exports.rejectApprove = async (user, bookingId) => {
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

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "KEY_TAKEN"
    },
  });

  await prisma.bicycle.update({
    where: { id: booking.bicycleId },
    data: { status: "IN_USE" },
  });

  return {
    message: "Return rejected",
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

exports.getOpenAdminBookings = async (user) => {
  // admin only
  if (user.role !== "ADMIN") {
    const error = new Error("Admin only");
    error.status = 403;
    throw error;
  }

  // bookings where admin still has to act:
  // - BOOKED  -> need to issue key
  // - RETURN_PENDING -> need to approve return
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["BOOKED", "RETURN_PENDING", "KEY_TAKEN", "CANCELLED"] },
    },
    include: {
      user: true,
      bicycle: true,
    },
    orderBy: {
      bookingTime: "desc",
    },
  });

  return {
    success: true,
    bookings,
  };
};