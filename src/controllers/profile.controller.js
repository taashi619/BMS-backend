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
