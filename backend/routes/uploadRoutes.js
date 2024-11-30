import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import multer from "multer";
import express from "express";
const router = express.Router();
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  if (req.file) {
    res.status(200).send({
      message: "Image uploaded successfully",
      image: req.file.path, // Cloudinary URL
    });
  } else {
    res.status(400).send({ message: "No image file provided" });
  }
});

export default router;
