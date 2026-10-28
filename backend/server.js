import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import {
  apiLimiter,
} from "./middleware/rateLimitMiddleware.js";

connectDB();

const app = express();

// ========================================
// SECURITY MIDDLEWARE
// ========================================

// Security-related HTTP headers
app.use(helmet());

// Remove Express information header
app.disable("x-powered-by");

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL ||
    "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow tools such as Postman
      // that do not send an Origin header.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          "Not allowed by CORS"
        )
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Limit JSON/body size
app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(cookieParser());

// General API rate limiting
app.use("/api", apiLimiter);

// ========================================
// ROUTES
// ========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

// ========================================
// TEST ROUTES
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "ShopEase API is running",
  });
});

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Frontend connected to ShopEase backend",
  });
});

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Unhandled error:",
      error
    );

    if (
      error.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Origin is not allowed",
      });
    }

    if (
      error.name ===
      "MulterError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Image cannot exceed 5MB"
            : error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
);

// ========================================
// START SERVER
// ========================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});