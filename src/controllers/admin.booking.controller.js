const adminBookingService = require("../services/admin.booking.service");

exports.issueKey = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);

    const result =
      await adminBookingService.issueKey(
        req.user,
        bookingId
      );

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Key issue failed",
    });
  }
};

exports.approveReturn = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);

    const result =
      await adminBookingService.approveReturn(
        req.user,
        bookingId
      );

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Approval failed",
    });
  }
};
