const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminBookingController = require("../controllers/admin.booking.controller");

// ADMIN gives key
router.patch(
  "/:id/key",
  auth,
  adminBookingController.issueKey
);

// ADMIN approve return
router.patch(
  "/:id/approve-return",
  auth,
  adminBookingController.approveReturn
);

module.exports = router;
