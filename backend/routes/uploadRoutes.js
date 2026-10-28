import express from "express";

import {
  uploadProductImage,
} from "../controllers/uploadController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/product-image",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  uploadProductImage
);

export default router;