// audit.route.js
const express = require("express");
const router = express.Router();
const auditController = require("../controllers/audit.controller");
const auth = require("../middleware/authMiddleware");

router.post(
  "/admin/bookings/:bookingId/adjust-fine",
  auth,           
  auditController.adjustFine
);

router.get(
  "/admin/audit-logs",
  auth,             
  auditController.listAuditLogs
)

module.exports = router;