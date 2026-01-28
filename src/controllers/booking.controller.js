const bookingService = require("../services/booking.service");

exports.createBooking = async (req, res) => {
  try {
    const result = await bookingService.createBooking(
      req.user,
      req.body
    );

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Booking failed",
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getMyBookings(
      req.user
    );

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

exports.returnBicycle = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);

    const result = await bookingService.returnBicycle(
      req.user,
      bookingId
    );

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Return failed",
    });
  }
};
