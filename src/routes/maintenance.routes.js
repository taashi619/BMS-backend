const express = require('express');
const maintenanceController = require('../controllers/maintenance.controller');
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const upload = require("../middleware/upload");
// POST /maintenance/report
router.post('/report', auth,upload.single("photo"), maintenanceController.reportIssue);

// GET /maintenance/queue (admin view)
router.get('/queue', auth, maintenanceController.getQueue);

module.exports = router;
