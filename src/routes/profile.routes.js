const express = require("express");
const controller = require("../controllers/profile.controller");
const auth = require("../middleware/authMiddleware");
const adminBookingController = require("../controllers/admin.booking.controller");
const router = express.Router();

router.get("/", auth, controller.getProfile);

router.put("/", auth, controller.updateProfile);

router.post(
  "/add/student",
  auth,
  adminBookingController.createStudentByAdmin
);

module.exports = router;        
