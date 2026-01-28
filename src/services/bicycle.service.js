const prisma = require("../config/db");

exports.getAvailableBicycles = async () => {
  return prisma.bicycle.findMany({
    where: {
      isActive: true,
      status: "AVAILABLE",
    },
  });
};

exports.getAllBicycles = async (req, res) => {
  try {
    const bicycles = await bicycleService.getAllBicycles(req.user);
    res.json(bicycles);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

exports.getAllBicycles = async (user) => {
  if (user.role !== "ADMIN") {
    const error = new Error("Access denied");
    error.status = 403;
    throw error;
  }

  return prisma.bicycle.findMany({
    include: {
      booking: true, // optional: see who booked it
    },
  });
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