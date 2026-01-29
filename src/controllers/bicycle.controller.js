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

exports.getAllBicycles = async (req, res) => {
  try {
    const bicycles = await bicycleService.getAllBicycles(req.user);
    res.json(bicycles);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.updateBicycle = async (req, res) => {
  try {
    const bicycle = await bicycleService.updateBicycle(
      req.user,
      req.params.id,
      req.body
    );
    res.json(bicycle);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.updateBicycleStatus = async (req, res) => {
  try {
    const bicycle = await bicycleService.updateBicycleStatus(
      req.user,
      req.params.id,
      req.body.status
    );
    res.json(bicycle);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.deactivateBicycle = async (req, res) => {
  try {
    const bicycle = await bicycleService.deactivateBicycle(
      req.user,
      req.params.id
    );
    res.json(bicycle);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};