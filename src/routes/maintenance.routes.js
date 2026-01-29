const express = require('express');
const maintenanceController = require('../controllers/maintenance.controller');
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// POST /maintenance/report
router.post('/report', auth, maintenanceController.reportIssue);

// GET /maintenance/queue (admin view)
router.get('/queue', auth, maintenanceController.getQueue);

module.exports = router;
