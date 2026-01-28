const maintenanceService = require('../services/maintenance.service');

exports.reportIssue = async (req, res) => {
  try {
    const user = req.user; // Auth middleware should attach user
    const { bicycleId, description, photoUrl } = req.body;

    const issue = await maintenanceService.reportMaintenanceIssue(user, {
      bicycleId,
      description,
      photoUrl,
    });

    res.status(201).json({ success: true, issue });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

exports.getQueue = async (req, res) => {
  try {
    const adminUser = req.user;

    const queue = await maintenanceService.getMaintenanceQueue(adminUser);

    res.status(200).json({ success: true, queue });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};
