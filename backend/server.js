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
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Remove Express information header
app.disable("x-powered-by");

// CORS Configuration
const cleanOrigin = (url) => (url ? url.trim().replace(/\/+$/, "") : "");

const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map(cleanOrigin)
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://shop-ease-c8jv.vercel.app",
];

const allowedOriginsSet = new Set([...defaultOrigins, ...configuredOrigins]);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests like Postman/curl

  const normalized = cleanOrigin(origin);

  if (allowedOriginsSet.has(normalized)) {
    return true;
  }

  // Allow all Vercel deployments (production, previews, branch deploys)
  if (/^https:\/\/.*\.vercel\.app$/i.test(normalized)) {
    return true;
  }

  if (configuredOrigins.includes("*")) {
    return true;
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    console.warn(`[CORS] Blocked request from origin: ${origin}`);
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
    "OPTIONS",
    "HEAD",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],

  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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

export default app;
