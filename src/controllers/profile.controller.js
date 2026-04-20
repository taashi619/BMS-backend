const profileService = require("../services/profile.service");

exports.getProfile = async (req, res) => {
  try {
    const profile = await profileService.getProfile(req.user);

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to load profile",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await profileService.updateProfile(
      req.user,
      req.body
    );

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to update profile",
    });
  }
};
exports.getAllStudents = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view students",
      });
    }

    const students = await profileService.getAllStudents(req.query);

    res.json({
      success: true,
      students,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Failed to load students",
    });
  }
};