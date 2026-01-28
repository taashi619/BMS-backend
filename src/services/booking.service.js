const prisma = require("../config/db");

exports.createBooking = async (user, data) => {
  const { bicycleId, helmetRequired, note } = data;

  if (user.role !== "STUDENT") {
    const error = new Error("Only students can book bicycles");
    error.status = 403;
    throw error;
  }

  const bicycle = await prisma.bicycle.findUnique({
    where: { id: bicycleId },
  });

  if (!bicycle || bicycle.status !== "AVAILABLE") {
    const error = new Error("Bicycle not available");
    error.status = 400;
    throw error;
  }

  const booking = await prisma.booking.create({
    data: {
      userId: user.userId,
      bicycleId,
      helmetRequired,
      note,
    },
  });

  await prisma.bicycle.update({
    where: { id: bicycleId },
    data: { status: "BOOKED" },
  });

  return {
    message: "Booking successful",
    booking,
  };
};

exports.getMyBookings = async (user) => {
  return prisma.booking.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      bicycle: true,
    },
  });
};

exports.returnBicycle = async (user, bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== "KEY_TAKEN") {
    const error = new Error("Bicycle not currently in use");
    error.status = 400;
    throw error;
  }

  if (booking.userId !== user.userId) {
    const error = new Error("Not your booking");
    error.status = 403;
    throw error;
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "RETURN_PENDING",
      actualReturnTime: new Date(),
    },
  });

  await prisma.bicycle.update({
    where: { id: booking.bicycleId },
    data: { status: "AVAILABLE" },
  });

  return {
    message: "Bicycle returned. Awaiting admin approval.",
  };
};

exports.getAllBookings = async (user, filters = {}) => {
  if (user.role !== "ADMIN") {
    const error = new Error("Access denied");
    error.status = 403;
    throw error;
  }

  const { bicycleId, studentName, studentEmail, status } = filters;

  return prisma.booking.findMany({
    where: {
      ...(bicycleId && { bicycleId }),
      ...(status && { status }),
      user: {
        ...(studentEmail && { email: { contains: studentEmail, mode: 'insensitive' } }),
        ...(studentName && {
          OR: [
            { firstName: { contains: studentName, mode: 'insensitive' } },
            { lastName: { contains: studentName, mode: 'insensitive' } },
          ],
        }),
      },
    },
    include: {
      user: true,     // includes firstName, lastName, email
      bicycle: true,  // includes bicycle details
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};


