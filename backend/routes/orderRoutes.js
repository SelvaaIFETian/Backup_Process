const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// ✅ Create new Order from Cart (Checkout)
router.post("/checkout", orderController.createOrder);  

// ✅ Buy Now (single product order)
router.post("/buy-now", orderController.buyNow);

// ✅ Get all orders for a user         
router.get("/userid/:userId", orderController.getUserOrders);

// ✅ Get single order by ID
router.get("/orderid/:orderId", orderController.getOrderById);

// ✅ Update order status (Admin)
router.put("/orderid/:orderId/status", orderController.updateOrderStatus);

// ✅ Cancel order (User)
router.put("/orderid/:orderId/cancel", orderController.cancelOrder);

module.exports = router;
