const auditService = require("../services/audit.service");

exports.adjustFine = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { newFineAmount, reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Reason is required." });
    }
    if (newFineAmount === undefined || isNaN(Number(newFineAmount))) {
      return res
        .status(400)
        .json({ message: "newFineAmount must be a number." });
    }

    const updated = await auditService.adjustFine(
      req.user, // from auth middleware
      bookingId,
      Number(newFineAmount),
      reason.trim()
    );

    return res.json({
      message: "Fine adjusted successfully",
      booking: updated,
    });
  } catch (err) {
    next(err); // or res.status(500).json({ message: err.message });
  }
};
exports.listAuditLogs = async (req, res, next) => {
  try {
    const { bookingId, skip, take } = req.query;

    const logs = await auditService.listAuditLogs(req.user, {
      bookingId,
      skip,
      take,
    });

    return res.json({ logs });
  } catch (err) {
    next(err); // or res.status(500).json({ message: err.message });
  }
};