// const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

exports.uploadToS3 = async (file) => {
  try {
    const uploadsDir = path.join(__dirname, "..", "..", "uploads", "complaints");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeFileName = `${Date.now()}-${uuidv4()}-${file.originalname.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadsDir, safeFileName);

    fs.writeFileSync(filePath, file.buffer);

    return `${process.env.BASE_URL || "http://localhost:5000"}/uploads/complaints/${safeFileName}`;
  } catch (error) {
    console.error("Local Upload Error:", error);
    throw new Error("Failed to upload file");
  }
};