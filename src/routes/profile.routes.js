const express = require("express");
const controller = require("../controllers/profile.controller");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", auth, controller.getProfile);

router.put("/", auth, controller.updateProfile);


module.exports = router;        
