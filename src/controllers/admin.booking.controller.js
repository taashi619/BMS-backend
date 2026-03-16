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

exports.createStudentByAdmin = async (req, res) => {
  try {

    const result =
      await adminBookingService.createStudentByAdmin(
        req.user,
        req.body
      );

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "process failed",
    });
  }
};

exports.getMyTotalFine = async (req, res) => {
  try {
    const result = await adminBookingService.getMyTotalFine(req.user);
    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
};