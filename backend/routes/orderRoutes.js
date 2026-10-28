import express from "express";

import {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// ADMIN ROUTES
// Keep these before /:id
// ========================================

router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);

router.get(
  "/admin/:id",
  protect,
  authorizeRoles("admin"),
  getAdminOrderById
);

router.put(
  "/admin/:id/status",
  protect,
  authorizeRoles("admin"),
  updateOrderStatus
);

// ========================================
// CUSTOMER ROUTES
// ========================================

router.post("/", protect, createOrder);

router.get("/", protect, getMyOrders);

router.get("/:id", protect, getMyOrderById);

export default router;