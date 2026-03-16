const complaintService = require("../services/complain.service");
const s3Service = require("../services/s3Complains.service");

exports.createComplaint = async (req, res) => {
    try {
        const user = req.user;
        const { description } = req.body;
        let photoUrl = null;

        if (req.file) {
            photoUrl = await s3Service.uploadToS3(req.file);
        }
        console.log(photoUrl);
        const complaint = await complaintService.createComplaint(
            user,
            description,
            photoUrl
        );

        res.status(201).json({ success: true, complaint });
    } catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const admin = req.user;
        const complaints = await complaintService.getAllComplaints(admin);

        res.json({ success: true, complaints });
    } catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;
        const { status } = req.body;

        const updated = await complaintService.updateComplaintStatus(
            admin,
            Number(id),
            status
        );

        res.json({ success: true, complaint: updated });
    } catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.getMyComplaints = async (req, res) => {
  try {
    const result = await complaintService.getMyComplaints(req.user);
    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
};