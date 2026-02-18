const express = require('express');
const auth = require("../middleware/authMiddleware");
const complainController = require('../controllers/complain.controller');
const router = express.Router();
const upload = require("../middleware/upload");
// POST /complain/report
router.post('/report', auth, upload.single("photo"), complainController.createComplaint);

// GET /complain/all (admin view)
router.get('/all', auth, complainController.getAllComplaints);
router.patch(
    '/:id/status',
    auth,
    complainController.updateComplaintStatus
);

router.get("/my", authMiddleware, complaintController.getMyComplaints);

module.exports = router;
