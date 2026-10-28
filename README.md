# 🛒 ShopEase — MERN E-Commerce Application

ShopEase is a full-stack e-commerce web application built with the MERN stack.

It provides separate customer and admin workflows, including authentication, role-based authorization, product management, persistent shopping cart, checkout, order management, stock handling, and Cloudinary image uploads.

The project focuses on clean REST API architecture, secure authentication, backend validation, transactional stock management, and responsive user interfaces.

---

## ✨ Features

### Customer

- Register and login
- JWT authentication
- Browse products
- Search products
- Filter products by category
- Sort products by price
- View product details
- Add products to persistent cart
- Update cart quantity
- Remove products from cart
- Checkout using Cash on Delivery
- Delivery information validation
- View personal orders
- View order details
- Account page
- Responsive UI

### Admin

- Secure admin-only routes
- Create products
- Update products
- Soft-delete products
- Upload product images
- View all customer orders
- View order details
- Update order status
- Manage order workflow

---

## 🛠 Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary

### Security

- Helmet
- CORS
- Express Rate Limit
- JWT Authentication
- Role-Based Access Control
- Request validation
- API body-size limits
- Password hashing

---

## 🔐 Authentication & Authorization

ShopEase uses JWT-based authentication.

After successful login, the backend generates a JWT containing the user's ID and role.

Protected routes require:

Authorization: Bearer <token>

Two roles are supported:

- customer
- admin

Public registration always creates a customer account.

Admin functionality is protected using role-based authorization middleware.

---

## 🛍 Product Management

Products contain information such as:

- Name
- Description
- Price
- Category
- Stock
- Image
- Active status

Customers can view active products.

Admins can:

- Create products
- Update products
- Remove products

Product deletion uses soft deletion by marking the product as inactive.

---

## 🌱 Database Seeding

To seed the store with Admin & Customer users, Categories, and luxury Products across all collections:

`ash
cd backend
npm run seed
`

### Modular Seeding Commands

`ash
# Seed only Admin and Customer accounts
npm run seed:users

# Seed only Categories
npm run seed:categories

# Seed Categories and Products
npm run seed:products

# Reset / Destroy all seeded records
npm run seed:destroy
`

### Default Seed Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | ShopEase Admin | dmin@shopease.com | dmin123 |
| **Customer** | Sophia Laurent | customer@shopease.com | customer123 |
| **Customer** | Alexander Wright | lexander@shopease.com | customer123 |
| **Customer** | Elena Rostova | elena@shopease.com | customer123 |

---

## 🛒 Persistent Cart

Each authenticated customer has a database-backed cart.

The cart supports:

- Add item
- Update quantity
- Remove item
- Stock validation
- Persistent cart data

Product availability and stock are checked by the backend.

---

## 📦 Checkout & Orders

ShopEase currently supports:

Cash on Delivery (COD)

During checkout, the backend:

1. Validates delivery information.
2. Loads the customer's cart.
3. Validates product availability.
4. Validates stock.
5. Calculates the total on the server.
6. Atomically reduces product stock.
7. Creates the order.
8. Clears the customer's cart.

MongoDB transactions are used to protect the checkout process from partial updates.

The frontend does not control the trusted order total.

---

## 🚚 Order Status Workflow

Supported statuses:

Pending
→ Confirmed
→ Processing
→ Shipped
→ Delivered

Orders can also be cancelled during supported stages.

Allowed transitions:

- Pending → Confirmed
- Pending → Cancelled
- Confirmed → Processing
- Confirmed → Cancelled
- Processing → Shipped
- Processing → Cancelled
- Shipped → Delivered

Delivered and Cancelled orders are final.

When an eligible order is cancelled, its stock is restored.

---

## ☁️ Product Images

Product images are uploaded using:

- Multer
- Cloudinary

Supported formats:

- JPG / JPEG
- PNG
- WEBP

Maximum upload size:

5 MB

The Cloudinary image URL is stored with the product.

---

## 🛡 Security Features

ShopEase includes:

- Password hashing with bcrypt
- JWT authentication
- Customer/Admin RBAC
- Helmet security headers
- CORS configuration
- General API rate limiting
- Authentication rate limiting
- Request body-size limits
- Server-side input validation
- ObjectId validation
- Safer product search handling
- Generic login errors for invalid credentials
- Server-side order total calculation
- Transactional stock updates
- Controlled order status transitions
- Global API error handling
- 404 API handling

---

## 📁 Project Structure

```text
shopease/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md