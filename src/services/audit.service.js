const { Prisma } = require("@prisma/client");
const prisma = require("../config/db");

function adminOnly(user) {
  if (user.role !== "ADMIN") {
    const error = new Error("Admin access only");
    error.status = 403;
    throw error;
  }
}

exports.adjustFine = async (user, bookingId, newFineAmount, reason) => {
  adminOnly(user);

  const admin = await prisma.admin.findUnique({
    where: { userId: user.userId },
  });
  if (!admin) {
    const error = new Error("Admin record not found");
    error.status = 403;
    throw error;
  }

  const booking = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
    include: { user: { include: { student: true } } },
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }
  if (!booking.user.student) {
    const error = new Error("Student record not found for booking");
    error.status = 400;
    throw error;
  }

  // previous and new fine as Decimals
  const previousFine = booking.fineAmount ?? new Prisma.Decimal(0);
  const newFineDec = new Prisma.Decimal(newFineAmount);

  // update booking fine
  const updatedBooking = await prisma.booking.update({
    where: { id: Number(bookingId) },
    data: { fineAmount: newFineDec },
  });

  // recompute student's total fines
  const allBookings = await prisma.booking.findMany({
    where: { userId: booking.userId },
    select: { fineAmount: true },
  });

  const newTotalFines = allBookings.reduce(
    (acc, b) => acc.plus(b.fineAmount),
    new Prisma.Decimal(0)
  );

  await prisma.student.update({
    where: { id: booking.user.student.id },
    data: { totalFines: newTotalFines },
  });

  // create audit log with previous/new fine
  await prisma.auditLog.create({
    data: {
      bookingId: Number(bookingId),
      adminId: admin.id,
      actionType: "UNDO_CHARGE",
      reason,
      previousFineAmount: previousFine,
      newFineAmount: newFineDec,
    },
  });

  return updatedBooking;
};

exports.listAuditLogs = async (user, options = {}) => {
  adminOnly(user);

  const { bookingId, skip = 0, take = 50 } = options;

  const where = {};
  if (bookingId) where.bookingId = Number(bookingId);

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { timestamp: "desc" },
    skip: Number(skip),
    take: Number(take),
    include: {
      admin: {
        include: {
          user: true,
        },
      },
      booking: {
        include: {
          user: {
            include: { student: true },
          },
        },
      },
    },
  });

  return logs.map((log) => {
    const student = log.booking.user.student;
    const studentUser = log.booking.user;

    return {
      id: log.id,
      actionType: log.actionType,
      reason: log.reason,
      timestamp: log.timestamp,

      adminName: `${log.admin.user.firstName} ${log.admin.user.lastName}`,
      bookingId: log.bookingId,

      studentIndex: student?.indexNo,
      studentName: `${studentUser.firstName} ${studentUser.lastName}`,
      studentFaculty: student?.faculty,
      studentRoom: student?.roomNumber,
      studentTotalFines: student?.totalFines,

      // current fine after this action (from booking)
      fineAmount: log.booking.fineAmount,

      // new fields from AuditLog table
      previousFineAmount: log.previousFineAmount,
      newFineAmount: log.newFineAmount,
    };
  });
};