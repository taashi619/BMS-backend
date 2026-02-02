const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const bookingController = require("../controllers/booking.controller");

// CREATE BOOKING
router.post("/", auth, bookingController.createBooking);

// VIEW MY BOOKINGS
router.get("/my", auth, bookingController.getMyBookings);

// RETURN BICYCLE
router.patch("/:id/return", auth, bookingController.returnBicycle);

router.patch("/:id/cancel", auth, bookingController.cancelBooking);

module.exports = router;
