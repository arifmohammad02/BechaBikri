import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import sendEmail from "../utils/sendEmail.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce((acc, item) => {
    const discount = (item.price * item.discountPercentage) / 100;
    const discountedPrice = item.price - discount;
    return acc + discountedPrice * item.qty;
  }, 0);

  const shippingPrice = orderItems.reduce(
    (acc, item) => acc + (item.shippingCharge ?? 0),
    0,
  );

  const taxRate = 0.0;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const generateOrderId = () => {
  return (
    Date.now().toString().slice(-3) + // শেষ ৩ সংখ্যা (Timestamp থেকে)
    Math.floor(100 + Math.random() * 900) // ৩-সংখ্যার র্যান্ডম নাম্বার
  );
};

console.log(generateOrderId()); // যেমন: 345678

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // Check if orderItems is provided and is an array
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }
    // Verify payment method
    if (paymentMethod !== "PayPal" && paymentMethod !== "Cash on Delivery") {
      return res.status(400).json({ msg: "Invalid payment method." });
    }

    // Fetch items from the database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Validate and map the order items
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id,
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        shippingCharge: shippingAddress?.shippingCharge ?? 0,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(
      dbOrderItems,
      shippingAddress,
    );

    // Payment status based on payment method
    const paymentStatus =
      paymentMethod === "Cash on Delivery" ? "due" : "pending";
    const isPaid = false; // Default false

    const order = new Order({
      orderId: generateOrderId(),
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentStatus, // ✅ নতুন ফিল্ড
      isPaid, // ✅ ডিফল্ট false
    });

    const createdOrder = await order.save();

    // Populate user for email
    const populatedOrder = await createdOrder.populate(
      "user",
      "username email",
    );
    res.status(201).json(createdOrder);
    // -------- Send Email to Customer --------
    await sendEmail({
      to: populatedOrder.user.email,
      subject: "Order Confirmation",
      text: `Hi ${populatedOrder.user.username},\n\nYour order (${populatedOrder.orderId}) has been placed successfully!\n\nThank you for shopping with us.`,
    });

    // -------- Send Email to Admin --------
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Placed",
      text: `New order (${populatedOrder.orderId}) placed by ${populatedOrder.user.username}. Total: ₹${totalPrice}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrdersByDate = async (req, res) => {
  try {
    const ordersByDate = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Dhaka",
            },
          },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } }, // সর্বশেষ দিনের ডাটা প্রথমে দেখাবে
    ]);

    res.json(ordersByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$paidAt",
              timezone: "Asia/Dhaka",
            },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLocalTime = (utcTime) => {
  return new Date(utcTime).toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email",
    );

    if (order) {
      const response = {
        ...order.toObject(),
        paidAt: order.paidAt ? getLocalTime(order.paidAt) : null,
        deliveredAt: order.deliveredAt ? getLocalTime(order.deliveredAt) : null,
      };
      res.json(response);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // নতুন স্ট্যাটাসটি রিকোয়েস্ট থেকে নিতে হবে, ডিফল্ট 'Delivered' সেট করা হলো
      const newStatus = req.body.status || "Delivered";

      if (
        ![
          "Order Placed",
          "Processing",
          "Shipped",
          "Out for Delivery",
          "Delivered",
          "Cancelled",
        ].includes(newStatus)
      ) {
        return res.status(400).json({ error: "Invalid delivery status" });
      }

      order.isDelivered = newStatus;
      order.deliveredAt = new Date();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    console.log("Request params:", req.params); // Check if id is received
    console.log("Request body:", req.body); // Check if status is received

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { status } = req.body; // Should be "paid" or "due"

    // Validate status
    const validStatuses = ["paid", "due", "pending", "failed"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    // If no status is provided, use default behavior (old function logic)
    if (!status) {
      // Use the provided paidAt time or fallback to the current time
      const paidAtTime = req.body.paidAt
        ? new Date(req.body.paidAt)
        : new Date();

      order.isPaid = true;
      order.paidAt = paidAtTime;

      if (order.paymentMethod !== "Cash on Delivery") {
        order.paymentResult = {
          id: req.body.id || "N/A",
          status: req.body.status || "Completed",
          update_time: req.body.update_time || paidAtTime.toISOString(),
          email_address: req.body.payer?.email_address || "N/A",
        };
      }
    } else {
      // New logic with status parameter
      // Update payment status
      order.paymentStatus = status;

      // Update isPaid based on status
      order.isPaid = status === "paid";

      // Update paidAt timestamp if paid
      if (status === "paid") {
        order.paidAt = req.body.paidAt ? new Date(req.body.paidAt) : new Date();

        if (order.paymentMethod !== "Cash on Delivery") {
          order.paymentResult = {
            id: req.body.id || "N/A",
            status: req.body.status || "Completed",
            update_time: req.body.update_time || order.paidAt.toISOString(),
            email_address: req.body.payer?.email_address || "N/A",
          };
        }
      } else {
        order.paidAt = null;
        // Clear payment result if status is not paid
        order.paymentResult = undefined;
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { status } = req.body;

    const validStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    order.isDelivered = status;

    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  countTotalOrdersByDate,
  updateOrderStatus,
};
