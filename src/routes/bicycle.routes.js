const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const bicycleController = require("../controllers/bicycle.controller");

router.get(
  "/",
  auth,
  bicycleController.getAvailableBicycles
);
router.get("/all",auth, bicycleController.getAllBicycles);
router.post("/add",auth, bicycleController.createBicycle);
router.put("/:id",auth, bicycleController.updateBicycle);
router.patch("/:id/status",auth, bicycleController.updateBicycleStatus);
router.patch("/:id/deactivate",auth, bicycleController.deactivateBicycle);

module.exports = router;
