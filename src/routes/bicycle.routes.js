const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const bicycleController = require("../controllers/bicycle.controller");

router.get(
  "/",
  auth,
  bicycleController.getAvailableBicycles
);
router.get("/all",auth, controller.getAllBicycles);
router.post("/add",auth, controller.createBicycle);
router.put("/:id",auth, controller.updateBicycle);
router.patch("/:id/status",auth, controller.updateBicycleStatus);
router.patch("/:id/deactivate",auth, controller.deactivateBicycle);

module.exports = router;
