const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const sequelize = require("./config/db"); // Sequelize config
const User =require("./models/User");
const Cart =require("./models/Cart");
const Order =require("./models/Order");
const OrderItem =require("./models/OrderItem");
const Product =require("./models/Product");
const Wishlist=require("./models/Wishlist");
const ProductViewHistory=require("./models/ProductViewHistory");
const Brand = require("./models/Brand");
const authRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const brandRoutes =require("./routes/brandRoutes");






dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // handles JSON bodies
app.use(express.urlencoded({ extended: true })); // handles form submissions

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist",wishlistRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/brand",brandRoutes);

// 🔹 User ↔ Cart
User.hasMany(Cart, { foreignKey: "userId", as: "carts" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// 🔹 Product ↔ Cart
Product.hasMany(Cart, { foreignKey: "productId", as: "carts" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

// 🔹 Wishlist ↔ Product
Wishlist.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(Wishlist, { foreignKey: "productId", as: "wishlists" });

// 🔹 User ↔ Order
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// 🔹 Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// 🔹 Product ↔ OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

ProductViewHistory.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(ProductViewHistory, { foreignKey: "productId", as: "views" });

Brand.hasMany(Product, { foreignKey: "brandId", as: "products" });
Product.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });

// Root
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Sync DB and Start server
const PORT = process.env.PORT || 5000;
sequelize
  .sync()
  .then(() => {
    console.log("✅ Database connected & synced");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });   
