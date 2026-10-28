import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

if (process.env.MONGO_URI && process.env.MONGO_URI.startsWith("mongodb+srv://")) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (err) {
    // fallback
  }
}

import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

import users from "./data/users.js";
import categories from "./data/categories.js";
import products from "./data/products.js";

const mongoUri =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/shopease?replicaSet=rs0";

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅  Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Seed Users
const seedUsers = async () => {
  try {
    console.log("\n👤  Seeding Users...");

    // Hash passwords before insertion
    const preparedUsers = await Promise.all(
      users.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return {
          name: u.name,
          email: u.email.toLowerCase().trim(),
          password: hashedPassword,
          role: u.role,
        };
      })
    );

    // Delete existing seed users by email to avoid unique index conflict
    const emails = users.map((u) => u.email.toLowerCase().trim());
    await User.deleteMany({ email: { $in: emails } });

    const createdUsers = await User.insertMany(preparedUsers);
    console.log(`✨  Successfully seeded ${createdUsers.length} users:`);

    users.forEach((u) => {
      console.log(
        `     • [${u.role.toUpperCase()}] ${u.email}  |  Password: ${u.password}`
      );
    });

    return createdUsers;
  } catch (error) {
    console.error("❌  Failed to seed users:", error.message);
    throw error;
  }
};

// Seed Categories
const seedCategories = async () => {
  try {
    console.log("\n📁  Seeding Categories...");

    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);

    console.log(
      `✨  Successfully seeded ${createdCategories.length} categories:`
    );
    createdCategories.forEach((c) => {
      console.log(`     • ${c.name} (${c.slug})`);
    });

    return createdCategories;
  } catch (error) {
    console.error("❌  Failed to seed categories:", error.message);
    throw error;
  }
};

// Seed Products
const seedProducts = async () => {
  try {
    console.log("\n📦  Seeding Products...");

    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(products);

    console.log(
      `✨  Successfully seeded ${createdProducts.length} luxury products!`
    );

    // Group items count by category
    const categoryCounts = {};
    createdProducts.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    console.log("📊  Items per category:");
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`     • ${cat}: ${count} item(s)`);
    });

    return createdProducts;
  } catch (error) {
    console.error("❌  Failed to seed products:", error.message);
    throw error;
  }
};

// Destroy data
const destroyData = async (target) => {
  try {
    console.log("\n🗑   Destroying data...");

    if (!target || target === "all" || target === "users") {
      const emailList = users.map((u) => u.email.toLowerCase().trim());
      const resUsers = await User.deleteMany({ email: { $in: emailList } });
      console.log(`     • Removed ${resUsers.deletedCount} seed user(s).`);
    }

    if (!target || target === "all" || target === "categories") {
      const resCategories = await Category.deleteMany({});
      console.log(
        `     • Removed ${resCategories.deletedCount} category item(s).`
      );
    }

    if (!target || target === "all" || target === "products") {
      const resProducts = await Product.deleteMany({});
      console.log(`     • Removed ${resProducts.deletedCount} product(s).`);
    }

    console.log("✅  Data destruction complete.");
  } catch (error) {
    console.error("❌  Failed to destroy data:", error.message);
    throw error;
  }
};

// Main Runner
const run = async () => {
  const args = process.argv.slice(2);
  const isDestroy = args.includes("-d") || args.includes("--destroy");
  const isUsersOnly = args.includes("-u") || args.includes("--users");
  const isCategoriesOnly =
    args.includes("-c") || args.includes("--categories");
  const isProductsOnly = args.includes("-p") || args.includes("--products");

  await connectDB();

  try {
    if (isDestroy) {
      if (isUsersOnly) {
        await destroyData("users");
      } else if (isCategoriesOnly) {
        await destroyData("categories");
      } else if (isProductsOnly) {
        await destroyData("products");
      } else {
        await destroyData("all");
      }
    } else {
      if (isUsersOnly) {
        await seedUsers();
      } else if (isCategoriesOnly) {
        await seedCategories();
      } else if (isProductsOnly) {
        await seedCategories();
        await seedProducts();
      } else {
        // Default: Seed Users, Categories, and Products
        await seedUsers();
        await seedCategories();
        await seedProducts();
      }

      console.log("\n🎉  All requested seed operations finished successfully!");
    }
  } catch (err) {
    console.error("❌  Seeder execution aborted due to error.");
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔒  Database connection closed cleanly.\n");
    process.exit(0);
  }
};

run();
