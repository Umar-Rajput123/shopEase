import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    // Create an empty cart if the user does not have one yet
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Product ID is required
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Validate quantity
    if (
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // Check that product exists and is active
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is out of stock
    if (product.stock === 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // Check requested quantity against stock
    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available in stock`,
      });
    }

    // Find customer's cart
    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // Create cart if it does not exist
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Product is already in cart",
      });
    }

    // Add product to cart
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
    });

    // Save cart
    await cart.save();

    // Populate product information
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Validate quantity
    if (
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // Check that product exists and is active
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is out of stock
    if (product.stock === 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // Check requested quantity against current stock
    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) available in stock`,
      });
    }

    // Find the logged-in customer's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the product inside the cart
    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Update quantity
    cartItem.quantity = Number(quantity);

    // Save updated cart
    await cart.save();

    // Populate current product information
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated",
      cart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
  return res.status(400).json({
    success: false,
    message: "Invalid product ID",
  });
}
const cart = await Cart.findOne({
  user: req.user._id,
});

if (!cart) {
  return res.status(404).json({
    success: false,
    message: "Cart not found",
  });
}

const itemIndex = cart.items.findIndex(
  (item) => item.product.toString() === productId
);

if (itemIndex === -1) {
  return res.status(404).json({
    success: false,
    message: "Product not found in cart",
  });
}

cart.items.splice(itemIndex, 1);

await cart.save();

await cart.populate("items.product");

return res.status(200).json({
  success: true,
  message: "Product removed from cart",
  cart,
});


  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};