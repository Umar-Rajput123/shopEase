export const users = [
  {
    name: "ShopEase Admin",
    email: (process.env.ADMIN_EMAIL || "admin@shopease.com").toLowerCase().trim(),
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "admin",
  },
  {
    name: "Sophia Laurent",
    email: "customer@shopease.com",
    password: "customer123",
    role: "customer",
  },
  {
    name: "Alexander Wright",
    email: "alexander@shopease.com",
    password: "customer123",
    role: "customer",
  },
  {
    name: "Elena Rostova",
    email: "elena@shopease.com",
    password: "customer123",
    role: "customer",
  },
];

export default users;
