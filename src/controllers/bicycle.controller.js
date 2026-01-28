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
exports.createBicycle = async (req, res) => {
  try {
    const bicycle = await bicycleService.createBicycle(req.user, req.body);
    res.status(201).json({ success: true, bicycle });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};