const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
};
