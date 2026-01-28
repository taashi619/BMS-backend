const bicycleService = require("../services/bicycle.service");

exports.getAvailableBicycles = async (req, res) => {
  try {
    const bicycles =
      await bicycleService.getAvailableBicycles();

    return res.json(bicycles);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load bicycles",
    });
  }
};
