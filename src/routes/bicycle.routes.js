const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const bicycleController = require("../controllers/bicycle.controller");

router.get(
  "/",
  auth,
  bicycleController.getAvailableBicycles
);

module.exports = router;
