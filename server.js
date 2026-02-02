const express = require("express");
const cors = require("cors");
require("dotenv").config();
const prisma = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const bicycleRoutes = require("./src/routes/bicycle.routes");
const bookingRoutes = require("./src/routes/booking.routes");
const adminBookingRoutes = require("./src/routes/maintenance.routes");
const maintenanceRoutes = require("./src/routes/maintenance.routes");
const profileRoutes = require("./src/routes/profile.routes");



const app = express();
app.use(express.json());
app.use(cors());
// test route
app.get("/", (req, res) => {
    
    res.send("Bicycle Management Backend Running...");
});
//register route
app.use("/auth", authRoutes);
app.use("/bicycles", bicycleRoutes);
app.use("/bookings", bookingRoutes);
app.use("/booking-confirm", adminBookingRoutes);
app.use("/maintenance", maintenanceRoutes);
app.use("/profile", profileRoutes);

// test DB route
app.get("/test", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
