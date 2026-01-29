const express = require("express");
const controller = require("../controllers/profile.controller");
const router = express.Router();

router.get("/", controller.getProfile);

router.put("/", controller.updateProfile);


module.exports = router;        
