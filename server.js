const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const prisma = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const bicycleRoutes = require("./src/routes/bicycle.routes");
const bookingRoutes = require("./src/routes/booking.routes");
const adminBookingRoutes = require("./src/routes/admin.booking.routes");
const maintenanceRoutes = require("./src/routes/maintenance.routes");
const complainRoutes = require("./src/routes/complain.routes");
const profileRoutes = require("./src/routes/profile.routes");
const auditRoutes = require("./src/routes/audit.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bicycle Management Backend Running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/bicycles", bicycleRoutes);
app.use("/bookings", bookingRoutes);
app.use("/booking-confirm", adminBookingRoutes);
app.use("/maintenance", maintenanceRoutes);
app.use("/complain", complainRoutes);
app.use("/profile", profileRoutes);
app.use("/audit", auditRoutes);

app.get("/test", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});