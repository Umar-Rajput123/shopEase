import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteCategory,
  getCategories,
} from "../controllers/productController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/categories", getCategories);
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateProduct
);

router.delete(
  "/category/:category",
  protect,
  authorizeRoles("admin"),
  deleteCategory
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteProduct
);

export default router;
