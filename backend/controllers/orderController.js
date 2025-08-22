const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ✅ Create new Order from Cart
exports.createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod, shippingAddress } = req.body;

    // 1️⃣ Fetch user's cart
    const cartItems = await Cart.findAll({ where: { userId }, include: Product });

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2️⃣ Calculate total
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.quantity * item.Product.price;
    });

    // (Optional discount logic here)
    const discount = 0;
    const finalAmount = totalAmount - discount;

    // 3️⃣ Create Order
    const order = await Order.create({
      userId,
      totalAmount,
      discount,
      finalAmount,
      paymentMethod,
      shippingAddress
    });

    // 4️⃣ Create OrderItems
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
        totalPrice: item.quantity * item.Product.price
      });

      // reduce stock
      await Product.update(
        { stock: item.Product.stock - item.quantity },
        { where: { id: item.productId } }
      );
    }

    // 5️⃣ Clear Cart
    await Cart.destroy({ where: { userId } });

    res.status(201).json({ message: "Order placed successfully", orderId: order.id });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all orders for a user
// ✅ Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items", // 🔹 alias must match association
          include: [
            {
              model: Product,
              as: "product" // 🔹 alias must match association
            }
          ]
        }
      ]
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product"
            }
          ]
        }
      ]
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", status });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Cancel Order (User)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status === "Shipped" || order.status === "Delivered") {
      return res.status(400).json({ error: "Order cannot be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.buyNow = async (req, res) => {
  try {
    const { userId, productId, quantity, paymentMethod, shippingAddress } = req.body;

    // ✅ Validate product
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // ✅ Price calculation
    const totalAmount = product.price * quantity;
    const discount = 0; // (Later: coupon logic)
    const finalAmount = totalAmount - discount;

    // ✅ Create Order
    const order = await Order.create({
      userId,
      totalAmount,
      discount,
      finalAmount,
      paymentMethod,
      shippingAddress
    });

    // ✅ Create OrderItem
    await OrderItem.create({
      orderId: order.id,
      productId,
      quantity,
      price: product.price,
      totalPrice: totalAmount
    });

    // ✅ Update product stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({ message: "Order placed successfully (Buy Now)", orderId: order.id });

  } catch (error) {
    console.error("Error in Buy Now order:", error);
    res.status(500).json({ error: "Server error" });
  }
};