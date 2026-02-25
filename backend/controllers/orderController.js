import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import sendEmail from "../utils/sendEmail.js";
import { createAndSendNotification } from "./notificationController.js";



function calcPrices(dbOrderItems, shippingAddress) {
  const itemsPrice = dbOrderItems.reduce((acc, item) => {
    // Use variant price if available, otherwise use base price
    const itemPrice = item.variantInfo?.variantPrice
      ? Number(item.variantInfo.variantPrice)
      : Number(item.price) || 0;

    const discountPercent = Number(item.discountPercentage) || 0;
    const qty = Number(item.qty) || 1;

    const discount = (itemPrice * discountPercent) / 100;
    const discountedPrice = itemPrice - discount;

    return acc + discountedPrice * qty;
  }, 0);

  let totalWeight = 0;
  let maxFixedShipping = 0;
  let baseShippingRate = 0;

  const city = shippingAddress?.city?.trim().toLowerCase() || "";
  const isInsideDhaka = city.includes("dhaka");

  dbOrderItems.forEach((item) => {
    const s = item.shippingDetails;
    const type = s?.shippingType?.toLowerCase();

    if (type === "fixed") {
      const currentFixed = Number(s.fixedShippingCharge) || 0;
      if (currentFixed > maxFixedShipping) maxFixedShipping = currentFixed;
    } else if (type === "weight-based") {
      const weight = Number(item.weight) || 0.5;
      const qty = Number(item.qty) || 1;
      totalWeight += weight * qty;

      const rate = isInsideDhaka
        ? Number(s.insideDhakaCharge) || 80
        : Number(s.outsideDhakaCharge) || 150;

      if (rate > baseShippingRate) baseShippingRate = rate;
    }
  });

  const activeThresholds = dbOrderItems
    .filter((i) => i.shippingDetails?.isFreeShippingActive === true)
    .map((i) => Number(i.shippingDetails?.freeShippingThreshold))
    .filter((t) => !isNaN(t) && t > 0);

  const freeThreshold =
    activeThresholds.length > 0 ? Math.min(...activeThresholds) : Infinity;

  let finalShippingPrice = 0;

  if (itemsPrice < freeThreshold) {
    let dynamicShippingPrice = 0;
    if (totalWeight > 0) {
      dynamicShippingPrice = baseShippingRate;
      if (totalWeight > 1) {
        const extraWeight = Math.ceil(totalWeight - 1);
        dynamicShippingPrice += extraWeight * 20;
      }
    }
    finalShippingPrice = dynamicShippingPrice + maxFixedShipping;
  } else {
    finalShippingPrice = 0;
  }

  const taxRate = 0.0;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice =
    Number(itemsPrice) + Number(finalShippingPrice) + Number(taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: finalShippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}

const generateOrderId = () => {
  return (
    Date.now().toString().slice(-3) + 
    Math.floor(100 + Math.random() * 900)
  );
};

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // Check if orderItems is provided and is an array
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }
    const validMethods = [
      "PayPal",
      "Cash on Delivery",
      "bKash",
      "Nagad",
      "Rocket",
      "Bank",
    ];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ msg: "Invalid payment method." });
    }

    // Fetch items from the database

    const productIds = orderItems.map((x) => x._id || x.product);

    // Fetch items from the database
    const itemsFromDB = await Product.find({
      _id: { $in: productIds },
    });

    // Validate and map the order items
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const clientId = (
        itemFromClient._id || itemFromClient.product
      )?.toString();

      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === clientId,
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${clientId}`);
      }

      // Determine the correct image and price based on variant selection
      let itemImage = matchingItemFromDB.images[0];
      let itemPrice = Number(matchingItemFromDB.price);

      // Handle variant information
      let variantInfo = {
        hasVariants: false,
        colorIndex: null,
        colorName: "",
        colorHex: "",
        sizeIndex: null,
        sizeName: "",
        variantPrice: null,
        sku: "",
      };

      if (
        itemFromClient.variantInfo?.hasVariants &&
        matchingItemFromDB.hasVariants
      ) {
        const { colorIndex, sizeIndex } = itemFromClient.variantInfo;

        if (colorIndex !== null && matchingItemFromDB.variants[colorIndex]) {
          const variant = matchingItemFromDB.variants[colorIndex];

          // Update image to color-specific image
          itemImage = variant.color.image || matchingItemFromDB.images[0];

          variantInfo.hasVariants = true;
          variantInfo.colorIndex = colorIndex;
          variantInfo.colorName = variant.color.name;
          variantInfo.colorHex = variant.color.hexCode || "";

          if (sizeIndex !== null && variant.sizes[sizeIndex]) {
            const sizeVariant = variant.sizes[sizeIndex];
            itemPrice = sizeVariant.price;

            variantInfo.sizeIndex = sizeIndex;
            variantInfo.sizeName = sizeVariant.size;
            variantInfo.variantPrice = sizeVariant.price;
            variantInfo.sku = sizeVariant.sku || "";

            // Check stock for variant
            if (sizeVariant.countInStock < itemFromClient.qty) {
              res.status(400);
              throw new Error(
                `Insufficient stock for ${matchingItemFromDB.name} - ${variant.color.name} / ${sizeVariant.size}`,
              );
            }
          }
        }
      }

      return {
        name: matchingItemFromDB.name,
        qty: Number(itemFromClient.qty) || 1,
        image: itemImage,
        price: itemPrice,
        product: matchingItemFromDB._id,
        discountPercentage: Number(matchingItemFromDB.discountPercentage) || 0,
        weight: Number(matchingItemFromDB.weight) || 0.5,
        shippingDetails: {
          ...matchingItemFromDB.shippingDetails,
        },
        variantInfo: variantInfo,
        _id: undefined,
      };
    });

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(
      dbOrderItems,
      shippingAddress,
    );

    let paymentStatus;
    if (paymentMethod === "Cash on Delivery") {
      paymentStatus = "due";
    } else if (["bKash", "Nagad", "Rocket", "Bank"].includes(paymentMethod)) {
      paymentStatus = "awaiting_verification";
    } else {
      paymentStatus = "pending";
    }

    const order = new Order({
      orderId:
        typeof generateOrderId === "function" ? generateOrderId() : undefined,
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentStatus,
      isPaid: false,
    });

    const createdOrder = await order.save();

        for (const item of orderItems) {
          if (item.variantInfo?.hasVariants) {
            await Product.updateOne(
              {
                _id: item._id || item.product,
                "variants.color.name": item.variantInfo.colorName,
                "variants.sizes.size": item.variantInfo.sizeName,
              },
              {
                $inc: { "variants.$[v].sizes.$[s].countInStock": -item.qty },
              },
              {
                arrayFilters: [
                  { "v.color.name": item.variantInfo.colorName },
                  { "s.size": item.variantInfo.sizeName },
                ],
              },
            );
          }
        }

    // Notification Pathan
    try {
      await createAndSendNotification(req, {
        userId: order.user,
        title: "Order Placed! 🛒",
        message: `Your order #${order.orderId} has been confirmed.${
          ["bKash", "Nagad", "Rocket", "Bank"].includes(paymentMethod)
            ? " Please complete the payment."
            : ""
        }`,
        type: "order",
        actionUrl: `/order/${order._id}`,
        sendEmailFlag: true,
      });
    } catch (err) {
      console.error("Notification Error:", err.message);
    }

    // Populate user for email
    const populatedOrder = await createdOrder.populate(
      "user",
      "username email",
    );

    // --- আপডেট ৩: ইমেইল পাঠানোর সময় এরর হ্যান্ডলিং যোগ ---
    // এটি করলে ইমেইল সেন্ড হতে দেরি হলে বা ফেইল করলে কাস্টমার রেসপন্স পেতে দেরি হবে না
     const sendEmails = async () => {
       try {
         let paymentInstructions = "";
         if (["bKash", "Nagad", "Rocket", "Bank"].includes(paymentMethod)) {
           paymentInstructions = `<p style="color: #d97706; font-weight: bold;">Please complete your payment using ${paymentMethod} and submit the Transaction ID.</p>`;
         }

         // Build variant info for email
         let variantDetails = "";
         dbOrderItems.forEach((item) => {
           if (item.variantInfo?.hasVariants) {
             variantDetails += `<p style="font-size: 12px; color: #666;">Variant: ${item.variantInfo.colorName} / ${item.variantInfo.sizeName}</p>`;
           }
         });

         await sendEmail({
           to: populatedOrder.user.email,
           subject: "Order Confirmation",
           html: `<h2>Hi ${populatedOrder.user.username},</h2>
                  <p>Your order (${populatedOrder.orderId}) has been placed successfully!</p>
                  ${paymentInstructions}
                  ${variantDetails}
                  <p>Total: ৳${totalPrice}</p>`,
         });

         await sendEmail({
           to: process.env.ADMIN_EMAIL,
           subject: "New Order Placed",
           html: `<p>New order (${populatedOrder.orderId}) placed by ${populatedOrder.user.username}.</p>
          <p>Payment Method: ${paymentMethod}</p>
                  <p>Total: ৳${totalPrice}</p>`,
         });
       } catch (mailErr) {
         console.error("Email Sending Error:", mailErr.message);
       }
     };


    sendEmails();

    res.status(201).json(createdOrder);
  } catch (error) {
    // Render লগে এররটি স্পষ্ট দেখার জন্য console.log রাখা হলো
    console.error("Create Order Error:", error.message);
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

const getSalesSummaryByStatus = async (req, res) => {
  try {
    const summary = await Order.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          totalSales: { $sum: { $toDouble: "$totalPrice" } },
          orderCount: { $sum: 1 },
        },
      },
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDeliverySummary = async (req, res) => {
  try {
    const summary = await Order.aggregate([
      {
        $group: {
          _id: "$isDelivered",
          count: { $sum: 1 },
          totalAmount: { $sum: { $toDouble: "$totalPrice" } },
        },
      },
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Dhaka",
            },
          },
          totalSales: { $sum: { $toDouble: "$totalPrice" } },
        },
      },
      { $sort: { _id: 1 } },
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
    const { id } = req.params;

    const query = mongoose.isValidObjectId(id) ? { _id: id } : { orderId: id };

    const order = await Order.findOne(query).populate("user", "username email");

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
    console.error("Backend Error in findOrderById:", error.message);
    res.status(500).json({ error: error.message });
  }
};


const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
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
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { status } = req.body;
    const validStatuses = ["paid", "due", "pending", "failed"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    if (!status) {
      const paidAtTime = req.body.paidAt
        ? new Date(req.body.paidAt)
        : new Date();
      order.isPaid = true;
      order.paidAt = paidAtTime;
      order.paymentStatus = "paid";

      if (order.paymentMethod !== "Cash on Delivery") {
        order.paymentResult = {
          id: req.body.id || "N/A",
          status: req.body.status || "Completed",
          update_time: req.body.update_time || paidAtTime.toISOString(),
          email_address: req.body.payer?.email_address || "N/A",
        };
      }
    } else {
      order.paymentStatus = status;
      order.isPaid = status === "paid";

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
        order.paymentResult = undefined;
      }
    }

    const updatedOrder = await order.save();

    let notificationConfig = {
      userId: updatedOrder.user,
      type: "order",
      actionUrl: `/order/${updatedOrder.orderId}`,
      sendEmailFlag: true,
    };

    if (updatedOrder.paymentStatus === "paid") {
      notificationConfig.title = "Payment Received ✅";
      notificationConfig.message = `Payment for order #${updatedOrder.orderId} is successful.`;
    } else if (updatedOrder.paymentStatus === "due") {
      notificationConfig.title = "Payment Due ⏳";
      notificationConfig.message = `Payment is due for order #${updatedOrder.orderId}. Please complete it soon.`;
    } else if (updatedOrder.paymentStatus === "pending") {
      notificationConfig.title = "Payment Pending ⌛";
      notificationConfig.message = `Your payment for order #${updatedOrder.orderId} is currently pending.`;
    } else if (updatedOrder.paymentStatus === "failed") {
      notificationConfig.title = "Payment Failed ❌";
      notificationConfig.message = `Unfortunately, the payment for order #${updatedOrder.orderId} has failed.`;
    }

    if (notificationConfig.title) {
      await createAndSendNotification(req, notificationConfig);
    }

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

    await createAndSendNotification(req, {
      userId: updatedOrder.user,
      title: `Order Status: ${status}`,
      message: `Your order #${updatedOrder.orderId} has been updated to ${status}.`,
      type: "order",
      actionUrl: `/order/${updatedOrder.orderId}`,
      sendEmailFlag: true,
    });

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
  getSalesSummaryByStatus,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  countTotalOrdersByDate,
  getDeliverySummary,
  updateOrderStatus,
};
