const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async ({ email, password }) => {
  // find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      student: true,
      admin: true,
    },
  });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  // password check
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  // ===== STUDENT LOGIN =====
  if (user.role === "STUDENT") {
    if (!user.student) {
      const error = new Error("Student profile not found");
      error.status = 403;
      throw error;
    }

    if (user.student.isResidential === false) {
      const error = new Error("Only residential students allowed");
      error.status = 403;
      throw error;
    }
  }

  // ===== ADMIN LOGIN =====
  if (user.role === "ADMIN") {
    if (!user.admin) {
      const error = new Error("Admin profile not found");
      error.status = 403;
      throw error;
    }

    if (user.admin.status === false) {
      const error = new Error("Admin account disabled");
      error.status = 403;
      throw error;
    }
  }

  // generate token
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  return {
    message: "Login successful",
    token,
    role: user.role,
  };
};

exports.changePassword = async (userFromToken, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({
    where: { id: userFromToken.userId },
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.status = 400;
    throw error;
  }

  const SALT_ROUNDS = 10;
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return { message: "Password changed successfully" };
};
