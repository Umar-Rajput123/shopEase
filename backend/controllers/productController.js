import mongoose from "mongoose";
import Product from "../models/Product.js";

// Escape special RegExp characters from user input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ========================================
// CREATE PRODUCT
// POST /api/products
// ========================================

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
    } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      price === undefined ||
      typeof category !== "string" ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required product fields",
      });
    }

    const cleanName = name.trim();
    const cleanDescription = description.trim();
    const cleanCategory = category.trim();

    // Name
    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Product name cannot exceed 100 characters",
      });
    }

    // Description
    if (!cleanDescription) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required",
      });
    }

    if (cleanDescription.length > 2000) {
      return res.status(400).json({
        success: false,
        message:
          "Product description cannot exceed 2000 characters",
      });
    }

    // Category
    if (!cleanCategory) {
      return res.status(400).json({
        success: false,
        message: "Product category is required",
      });
    }

    if (cleanCategory.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Product category cannot exceed 100 characters",
      });
    }

    // Price
    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price must be a valid non-negative number",
      });
    }

    // Stock
    const numericStock = Number(stock);

    if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Stock must be a valid non-negative integer",
      });
    }

    // Image
    if (
      image !== undefined &&
      typeof image !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product image",
      });
    }

    const product = await Product.create({
      name: cleanName,
      description: cleanDescription,
      price: numericPrice,
      category: cleanCategory,
      stock: numericStock,
      image: image?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// GET PRODUCTS
// GET /api/products
// ========================================

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      sort,
    } = req.query || {};

    const filter = {
      isActive: true,
    };

    // Search
    if (
      typeof search === "string" &&
      search.trim()
    ) {
      const cleanSearch = search
        .trim()
        .slice(0, 100);

      filter.name = {
        $regex: escapeRegex(cleanSearch),
        $options: "i",
      };
    }

    // Category
    if (
      typeof category === "string" &&
      category.trim()
    ) {
      const cleanCategory = category
        .trim()
        .slice(0, 100);

      filter.category = {
        $regex: `^${escapeRegex(
          cleanCategory
        )}$`,
        $options: "i",
      };
    }

    // Sorting whitelist
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "price_asc") {
      sortOption = {
        price: 1,
      };
    }

    if (sort === "price_desc") {
      sortOption = {
        price: -1,
      };
    }

    const products = await Product.find(
      filter
    ).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// ========================================

export const getProductById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product =
      await Product.findOne({
        _id: id,
        isActive: true,
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ========================================

export const updateProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      image,
    } = req.body || {};

    // Name
    if (name !== undefined) {
      if (typeof name !== "string") {
        return res.status(400).json({
          success: false,
          message:
            "Product name must be text",
        });
      }

      const cleanName = name.trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message:
            "Product name cannot be empty",
        });
      }

      if (cleanName.length > 100) {
        return res.status(400).json({
          success: false,
          message:
            "Product name cannot exceed 100 characters",
        });
      }

      product.name = cleanName;
    }

    // Description
    if (description !== undefined) {
      if (
        typeof description !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product description must be text",
        });
      }

      const cleanDescription =
        description.trim();

      if (!cleanDescription) {
        return res.status(400).json({
          success: false,
          message:
            "Product description cannot be empty",
        });
      }

      if (
        cleanDescription.length > 2000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product description cannot exceed 2000 characters",
        });
      }

      product.description =
        cleanDescription;
    }

    // Category
    if (category !== undefined) {
      if (
        typeof category !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product category must be text",
        });
      }

      const cleanCategory =
        category.trim();

      if (!cleanCategory) {
        return res.status(400).json({
          success: false,
          message:
            "Product category cannot be empty",
        });
      }

      if (
        cleanCategory.length > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product category cannot exceed 100 characters",
        });
      }

      product.category =
        cleanCategory;
    }

    // Price
    if (price !== undefined) {
      const numericPrice =
        Number(price);

      if (
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Price must be a valid non-negative number",
        });
      }

      product.price = numericPrice;
    }

    // Stock
    if (stock !== undefined) {
      const numericStock =
        Number(stock);

      if (
        !Number.isInteger(numericStock) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stock must be a valid non-negative integer",
        });
      }

      product.stock = numericStock;
    }

    // Image
    if (image !== undefined) {
      if (typeof image !== "string") {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product image",
        });
      }

      product.image = image.trim();
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ========================================

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Product is already removed",
      });
    }

    // Soft delete
    product.isActive = false;

    await product.save();

    return res.status(200).json({
      success: true,
      message:
        "Product removed successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// DELETE CATEGORY (Soft delete all products in category)
// DELETE /api/products/category/:category
// ========================================

export const deleteCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category || typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const cleanCategory = category.trim();

    // Soft delete all active products belonging to this category
    const result = await Product.updateMany(
      {
        category: {
          $regex: `^${escapeRegex(cleanCategory)}$`,
          $options: "i",
        },
        isActive: true,
      },
      {
        $set: { isActive: false },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Category "${cleanCategory}" and its ${result.modifiedCount} product(s) retired successfully.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ========================================
// GET ALL CATEGORIES
// GET /api/products/categories
// ========================================

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    return res.status(200).json({
      success: true,
      count: categories.length,
      categories: categories.sort(),
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
