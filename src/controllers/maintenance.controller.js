const maintenanceService = require('../services/maintenance.service');
const s3Service = require("../services/s3.service");

exports.reportIssue = async (req, res) => {
  try {
    const user = req.user;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const bicycleId = req.body.bicycleId;
    const description = req.body.description;

    let photoUrl = null;

    if (req.file) {
      photoUrl = await s3Service.uploadToS3(req.file);
    }

    const issue = await maintenanceService.reportMaintenanceIssue(user, {
      bicycleId: Number(bicycleId),
      description,
      photoUrl,
    });

    res.status(201).json({
      success: true,
      issue,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// need to develop more 
exports.getQueue = async (req, res) => {
  try {
    const adminUser = req.user;

    const queue = await maintenanceService.getMaintenanceQueue(adminUser);

    res.status(200).json({ success: true, queue });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.changeMaintenanceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedMaintenance =
      await maintenanceService.updateMaintenanceStatus(
        req.user,
        id,
        status
      );

    res.status(200).json({
      message: 'Maintenance status updated successfully',
      data: updatedMaintenance,
    });
  } catch (error) {
    next(error);
  }
};
