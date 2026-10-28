import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ========================================
// CREATE ORDER
// POST /api/orders
// ========================================

export const createOrder = async (
  req,
  res
) => {
  const session =
    await mongoose.startSession();

  try {
    const {
      fullName,
      phone,
      address,
      city,
    } = req.body || {};

    // Type validation
    if (
      typeof fullName !== "string" ||
      typeof phone !== "string" ||
      typeof address !== "string" ||
      typeof city !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All delivery fields are required",
      });
    }

    const cleanFullName =
      fullName.trim();

    const cleanPhone =
      phone.trim();

    const cleanAddress =
      address.trim();

    const cleanCity =
      city.trim();

    // Required validation
    if (
      !cleanFullName ||
      !cleanPhone ||
      !cleanAddress ||
      !cleanCity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All delivery fields are required",
      });
    }

    // Name validation
    if (
      cleanFullName.length < 2 ||
      cleanFullName.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name must be between 2 and 100 characters",
      });
    }

    // Pakistan-style phone validation:
    // accepts digits, +, spaces and hyphens
    const phoneRegex =
      /^[0-9+\-\s()]{7,20}$/;

    if (
      !phoneRegex.test(cleanPhone)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid phone number",
      });
    }

    if (
      cleanAddress.length < 5 ||
      cleanAddress.length > 300
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Address must be between 5 and 300 characters",
      });
    }

    if (
      cleanCity.length < 2 ||
      cleanCity.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "City must be between 2 and 100 characters",
      });
    }

    session.startTransaction();

    const cart = await Cart.findOne({
      user: req.user._id,
    })
      .session(session)
      .populate("items.product");

    if (
      !cart ||
      cart.items.length === 0
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Validate all cart items again
    for (const item of cart.items) {
      if (
        !item.product ||
        !item.product.isActive
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message:
            "One or more cart products are no longer available",
        });
      }

      if (
        !Number.isInteger(
          item.quantity
        ) ||
        item.quantity < 1
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message:
            "Cart contains an invalid quantity",
        });
      }

      if (
        item.quantity >
        item.product.stock
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `Only ${item.product.stock} item(s) of ${item.product.name} are available`,
        });
      }
    }

    // Build trusted order snapshot
    const orderItems =
      cart.items.map((item) => ({
        product:
          item.product._id,

        productName:
          item.product.name,

        productImage:
          item.product.image || "",

        price:
          item.product.price,

        quantity:
          item.quantity,
      }));

    // IMPORTANT:
    // Total is calculated by backend.
    // Never trust frontend total.
    const totalAmount =
      orderItems.reduce(
        (total, item) =>
          total +
          item.price *
            item.quantity,
        0
      );

    const deliveryInfo = {
      fullName: cleanFullName,
      phone: cleanPhone,
      address: cleanAddress,
      city: cleanCity,
    };

    // ========================================
    // ATOMIC STOCK DEDUCTION
    // ========================================

    for (const item of orderItems) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            isActive: true,

            stock: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              stock:
                -item.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      if (!updatedProduct) {
        const stockError =
          new Error(
            `Insufficient stock for ${item.productName}`
          );

        stockError.statusCode = 400;

        throw stockError;
      }
    }

    const [order] =
      await Order.create(
        [
          {
            user:
              req.user._id,

            items:
              orderItems,

            deliveryInfo,

            totalAmount,

            paymentMethod:
              "COD",

            status:
              "Pending",
          },
        ],
        {
          session,
        }
      );

    // Clear cart only after
    // successful order creation
    cart.items = [];

    await cart.save({
      session,
    });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      order,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error(
      "Create order error:",
      error
    );

    if (
      error.statusCode === 400
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to place order. Please try again.",
    });
  } finally {
    await session.endSession();
  }
};

// ========================================
// CUSTOMER - GET OWN ORDERS
// GET /api/orders
// ========================================

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get your orders",
    });
  }
};

// ========================================
// CUSTOMER - GET OWN ORDER
// GET /api/orders/:id
// ========================================

export const getMyOrderById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order =
      await Order.findOne({
        _id: id,
        user: req.user._id,
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get order details error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get order details",
    });
  }
};

// ========================================
// ADMIN - GET ALL ORDERS
// GET /api/orders/admin/all
// ========================================

export const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "user",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get orders",
    });
  }
};

// ========================================
// ADMIN - GET ONE ORDER
// GET /api/orders/admin/:id
// ========================================

export const getAdminOrderById =
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID",
        });
      }

      const order =
        await Order.findById(
          id
        ).populate(
          "user",
          "name email role"
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error(
        "Get admin order error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to get order",
      });
    }
  };

// ========================================
// ADMIN - UPDATE ORDER STATUS
// PUT /api/orders/admin/:id/status
// ========================================

export const updateOrderStatus =
  async (req, res) => {
    const session =
      await mongoose.startSession();

    try {
      const { id } = req.params;
      const { status } =
        req.body || {};

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID",
        });
      }

      if (
        typeof status !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status",
        });
      }

      const validStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (
        !validStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status",
        });
      }

      session.startTransaction();

      const order =
        await Order.findById(
          id
        ).session(session);

      if (!order) {
        await session.abortTransaction();

        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      const currentStatus =
        order.status;

      if (
        currentStatus === status
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `Order is already ${status}`,
        });
      }

      const allowedTransitions = {
        Pending: [
          "Confirmed",
          "Cancelled",
        ],

        Confirmed: [
          "Processing",
          "Cancelled",
        ],

        Processing: [
          "Shipped",
          "Cancelled",
        ],

        Shipped: [
          "Delivered",
        ],

        Delivered: [],
        Cancelled: [],
      };

      if (
        !allowedTransitions[
          currentStatus
        ]?.includes(status)
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `Cannot change order status from ${currentStatus} to ${status}`,
        });
      }

      // Restore stock once if cancelled
      if (status === "Cancelled") {
        for (
          const item of order.items
        ) {
          await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: {
                stock:
                  item.quantity,
              },
            },
            {
              session,
            }
          );
        }
      }

      order.status = status;

      await order.save({
        session,
      });

      await session.commitTransaction();

      const updatedOrder =
        await Order.findById(
          id
        ).populate(
          "user",
          "name email role"
        );

      return res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order: updatedOrder,
      });
    } catch (error) {
      if (
        session.inTransaction()
      ) {
        await session.abortTransaction();
      }

      console.error(
        "Update order status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update order status",
      });
    } finally {
      await session.endSession();
    }
  };