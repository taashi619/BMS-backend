const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { login } = require('../controllers/authController');

router.post('/login', login);
router.patch("/change-password", authMiddleware, authController.changePassword);
module.exports = router;
