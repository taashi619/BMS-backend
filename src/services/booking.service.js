const prisma = require("../config/db");

exports.createBooking = async (user, data) => {
    const { bicycleId, helmetRequired, note } = data;

    if (user.role !== "STUDENT") {
        const error = new Error("Only students can book bicycles");
        error.status = 403;
        throw error;
    }
    const existingActive = await prisma.booking.findFirst({
        where: {
            userId: user.userId,
            status: { in: ["BOOKED", "KEY_TAKEN"] },
            actualReturnTime: null,
        },
    });
    if (existingActive) {
    const error = new Error("You already have an active booking");
    error.status = 400;
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
// bookingService.js
exports.cancelBooking = async (user, bookingId) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { bicycle: true },
    });

    if (!booking) {
        const error = new Error("Booking not found");
        error.status = 404;
        throw error;
    }

    if (booking.userId !== user.userId) {
        const error = new Error("You can only cancel your own bookings");
        error.status = 403;
        throw error;
    }

    if (booking.bicycle.status !== "BOOKED" || booking.keyTaken) {
        const error = new Error("Booking cannot be cancelled at this stage");
        error.status = 400;
        throw error;
    }

    // Update booking status
    await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
    });

    // Update bicycle status to AVAILABLE
    await prisma.bicycle.update({
        where: { id: booking.bicycleId },
        data: { status: "AVAILABLE" },
    });

    return { message: "Booking cancelled successfully" };
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

    return {
        message: "Bicycle returned. Awaiting admin approval.",
    };
};

function adminOnly(user) {
    if (user.role !== "ADMIN") {
        const error = new Error("Admin access only");
        error.status = 403;
        throw error;
    }
}



exports.getAllBookings = async (user, filters = {}) => {

    adminOnly(user);

    const { bicycleId, studentName, studentEmail, status, bicycleNum } = filters;

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
            bicycle: {
                ...(bicycleNum && { bicycleNumber: { contains: bicycleNum, mode: 'insensitive' } })
            }
        },
        include: {
            user: true,
            bicycle: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};


exports.createBicycle = async (user, data) => {
    adminOnly(user);

    return prisma.bicycle.create({
        data: {
            bicycleNumber: data.bicycleNumber,
        },
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