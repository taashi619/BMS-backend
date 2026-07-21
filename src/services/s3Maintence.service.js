const { PutObjectCommand } = require("@aws-sdk/client-s3");
// const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/s3");

// exports.uploadToS3 = async (file) => {
//   try {
//     const key = `maintenance/${Date.now()}-${uuidv4()}-${file.originalname}`;

//     const command = new PutObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     });

//     await s3.send(command);

//     return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
//   } catch (error) {
//     console.error("S3 Upload Error:", error);
//     throw new Error("Failed to upload file");
//   }
// };
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

exports.uploadToS3 = async (file) => {
  try {
    const uploadsDir = path.join(__dirname, "..", "uploads", "maintenance");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeFileName = `${Date.now()}-${uuidv4()}-${file.originalname.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadsDir, safeFileName);

    fs.writeFileSync(filePath, file.buffer);

    return `${process.env.BASE_URL || "http://localhost:5000"}/uploads/maintenance/${safeFileName}`;
  } catch (error) {
    console.error("Local Upload Error:", error);
    throw new Error("Failed to upload file");
  }
};