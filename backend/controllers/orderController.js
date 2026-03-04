import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import sendEmail from "../utils/sendEmail.js";
import { createAndSendNotification } from "./notificationController.js";

// Helper function to check if flash sale is active
const isFlashSaleActive = (flashSale) => {
  if (!flashSale || !flashSale.isActive) return false;

  const now = new Date();
  const startTime = new Date(flashSale.startTime);
  const endTime = new Date(flashSale.endTime);

  return now >= startTime && now <= endTime;
};

// Helper function to calculate effective price (flash sale + discount)
const calculateEffectivePrice = (product, variantPrice = null) => {
  const basePrice = variantPrice || product.price || 0;

  if (isFlashSaleActive(product.flashSale)) {
    const flashDiscount = product.flashSale.discountPercentage || 0;
    return basePrice - (basePrice * flashDiscount) / 100;
  }

  const discountPercent = product.discountPercentage || 0;
  if (discountPercent > 0) {
    return basePrice - (basePrice * discountPercent) / 100;
  }

  return basePrice;
};

const calculateSavings = (product, variantPrice = null) => {
  const basePrice = variantPrice || product.price || 0;

  if (isFlashSaleActive(product.flashSale)) {
    const flashDiscount = product.flashSale.discountPercentage || 0;
    return (basePrice * flashDiscount) / 100;
  }

  const discountPercent = product.discountPercentage || 0;
  return (basePrice * discountPercent) / 100;
};

function calcPrices(dbOrderItems, shippingAddress) {
  const itemsPrice = dbOrderItems.reduce((acc, item) => {
    const finalPrice = Number(item.finalPrice) || 0;
    const qty = Number(item.qty) || 1;
    return acc + finalPrice * qty;
  }, 0);

  const totalSavings = dbOrderItems.reduce((acc, item) => {
    const basePrice =
      Number(item.variantInfo?.variantPrice) || Number(item.price) || 0;
    const qty = Number(item.qty) || 1;
    const savingsPerItem = calculateSavings(
      item,
      item.variantInfo?.variantPrice,
    );
    return acc + savingsPerItem * qty;
  }, 0);

  let totalWeight = 0;
  let maxFixedShipping = 0;
  let hasWeightBased = false;
  let weightBasedCharge = 0;

  const city = shippingAddress?.city?.trim().toLowerCase() || "";
  const isInsideDhaka = city.includes("dhaka");

  // 👇 আপডেটেড লুপ
  dbOrderItems.forEach((item) => {
    const s = item.shippingDetails;
    const type = s?.shippingType?.toLowerCase();

    if (type === "fixed") {
      const currentFixed = Number(s.fixedShippingCharge) || 0;
      if (currentFixed > maxFixedShipping) maxFixedShipping = currentFixed;
    }
    // 👇 নতুন কেস: inside-outside
    else if (type === "inside-outside") {
      const charge = isInsideDhaka
        ? Number(s.insideDhakaCharge) || 80
        : Number(s.outsideDhakaCharge) || 150;
      if (charge > maxFixedShipping) maxFixedShipping = charge;
    }
    // 👇 ঠিক করা: weight-based
    else if (type === "weight-based") {
      hasWeightBased = true;
      const weight = Number(item.weight) || 0.5;
      const qty = Number(item.qty) || 1;
      totalWeight += weight * qty;
    }
  });

  // 👇 নতুন: ওজন অনুযায়ী চার্জ হিসাব
  if (hasWeightBased && totalWeight > 0) {
    const baseRate = isInsideDhaka ? 80 : 150;

    if (totalWeight <= 1) {
      weightBasedCharge = baseRate;
    } else {
      const extraWeight = Math.ceil(totalWeight - 1);
      weightBasedCharge = baseRate + extraWeight * 20;
    }
  }

  const activeThresholds = dbOrderItems
    .filter((i) => i.shippingDetails?.isFreeShippingActive === true)
    .map((i) => Number(i.shippingDetails?.freeShippingThreshold))
    .filter((t) => !isNaN(t) && t > 0);

  const freeThreshold =
    activeThresholds.length > 0 ? Math.min(...activeThresholds) : Infinity;

  let finalShippingPrice = 0;

  if (itemsPrice < freeThreshold) {
    // 👇 ঠিক করা: ফিক্সড vs ওয়েট-বেইজড এর মধ্যে বড়টি নেওয়া
    finalShippingPrice = Math.max(maxFixedShipping, weightBasedCharge);
  } else {
    finalShippingPrice = 0;
  }

  const taxRate = 0.0;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + finalShippingPrice + taxPrice;

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(finalShippingPrice.toFixed(2)),
    taxPrice: Number(taxPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
    totalSavings: Number(totalSavings.toFixed(2)),
  };
}

const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${timestamp}-${random}`;
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
      let originalPrice = itemPrice;

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

      const finalPrice = calculateEffectivePrice(matchingItemFromDB, itemPrice);

      // ✅ FIXED: Define isFlashSaleApplied before using it
      const isFlashSaleApplied = isFlashSaleActive(
        matchingItemFromDB.flashSale,
      );

      // Calculate discount percentage for order record
      let appliedDiscountPercent = 0;
      if (isFlashSaleApplied) {
        appliedDiscountPercent =
          matchingItemFromDB.flashSale.discountPercentage || 0;
      } else {
        appliedDiscountPercent = matchingItemFromDB.discountPercentage || 0;
      }

      return {
        name: matchingItemFromDB.name,
        qty: Number(itemFromClient.qty) || 1,
        image: itemImage,
        price: originalPrice,
        finalPrice: finalPrice,
        product: matchingItemFromDB._id,
        discountPercentage: appliedDiscountPercent,
        originalDiscountPercent: matchingItemFromDB.discountPercentage || 0,
        isFlashSaleApplied: isFlashSaleApplied, // ✅ Now properly defined
        weight: Number(matchingItemFromDB.weight) || 0.0,
        shippingDetails: {
          ...matchingItemFromDB.shippingDetails,
        },
        variantInfo: variantInfo,
      };
    });
    const { itemsPrice, shippingPrice, taxPrice, totalPrice, totalSavings } =
      calcPrices(dbOrderItems, shippingAddress);

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
      totalSavings,
      paymentStatus,
      isPaid: false,
    });

    const createdOrder = await order.save();

    for (const item of dbOrderItems) {
      // CHANGED: orderItems → dbOrderItems
      if (item.variantInfo?.hasVariants) {
        await Product.updateOne(
          {
            _id: item.product, // CHANGED: simplified
            "variants.color.name": item.variantInfo.colorName,
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
      } else {
        // ADDED: Simple product stock update
        await Product.updateOne(
          { _id: item.product },
          {
            $inc: {
              countInStock: -item.qty,
              salesCount: item.qty,
            },
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
            ? "Payment successful. Verification in progress."
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

    const sendEmails = async () => {
      try {
        let paymentInstructions = "";
        if (["bKash", "Nagad", "Rocket", "Bank"].includes(paymentMethod)) {
          paymentInstructions = `
        <div style="background-color: #fff9db; padding: 15px; border-left: 4px solid #fab005; margin-bottom: 20px;">
          <p style="color: #856404; font-weight: bold; margin: 0;">Payment Received!</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">
            Your payment via <strong>${paymentMethod}</strong> is currently undergoing verification. 
            We will notify you once it's confirmed.
          </p>
        </div>`;
        }

        // ⭐⭐⭐ ITEMS DETAILS BUILD করুন ⭐⭐⭐
        const itemsDetails = dbOrderItems
          .map((item) => {
            let variantText = "";
            if (item.variantInfo?.hasVariants) {
              variantText = `<br/><small style="color: #666;">Variant: ${item.variantInfo.colorName} / ${item.variantInfo.sizeName}</small>`;
            }

            let savingsText = "";
            if (item.isFlashSaleApplied || item.discountPercentage > 0) {
              savingsText = `<br/><small style="color: #dc2626;">You saved ৳${((item.price - item.finalPrice) * item.qty).toFixed(2)}</small>`;
            }

            return `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong>
                ${variantText}
                ${savingsText}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                ${item.qty}x
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                ৳${(item.finalPrice * item.qty).toFixed(2)}
              </td>
            </tr>
          `;
          })
          .join("");

        const itemsTable = `
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Image</th>
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsDetails}
            </tbody>
          </table>
        `;

        // ⭐ Customer Email
        await sendEmail({
          to: populatedOrder.user.email,
          subject: `Order Success - ${populatedOrder.orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Hi ${populatedOrder.user.username},</h2>
              <p>Thank you for your order! Your payment has been successfully submitted and is now being processed.</p>
              
              ${paymentInstructions}
              
              <h3>Order Summary:</h3>
              ${itemsTable}
              
              <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
                <p style="margin: 5px 0;"><strong>Order ID:</strong> #${populatedOrder.orderId}</p>
                <p style="margin: 5px 0;"><strong>Subtotal:</strong> ৳${itemsPrice}</p>
                <p style="margin: 5px 0;"><strong>Shipping:</strong> ${shippingPrice === "0.00" ? "FREE" : "৳" + shippingPrice}</p>
                ${Number(totalSavings) > 0 ? `<p style="margin: 5px 0; color: #dc2626;"><strong>Total Savings:</strong> ৳${Number(totalSavings).toFixed(2)}</p>` : ""}
                <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold;"><strong>Total Paid:</strong> ৳${totalPrice}</p>
              </div>
              
              <p style="font-size: 12px; color: #666; margin-top: 20px;">
                Note: Verification usually takes 10-30 minutes during working hours.
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #999; text-align: center;">
                © 2024 Becha Bikri. All rights reserved.
              </p>
            </div>
          `,
        });

        // ⭐ Admin Email
        const adminItemsList = dbOrderItems
          .map(
            (item) =>
              `<li>${item.name} ${item.variantInfo?.hasVariants ? `(${item.variantInfo.colorName}/${item.variantInfo.sizeName})` : ""} - ${item.qty}x - ৳${(item.finalPrice * item.qty).toFixed(2)}</li>`,
          )
          .join("");

        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `🔔 Action Required: New Order #${populatedOrder.orderId}`,
          html: `<div style="font-family: sans-serif; max-width: 600px;">
           <h3 style="color: #2563eb;">New Order Received!</h3>
           <p>A new order has been placed by <strong>${populatedOrder.user.username}</strong> (${populatedOrder.user.email}).</p>
           
           <h4>Items:</h4>
           <ul>${adminItemsList}</ul>
           
           <hr />
           <p><strong>Order ID:</strong> ${populatedOrder.orderId}</p>
           <p><strong>Payment Method:</strong> ${paymentMethod}</p>
           <p><strong>Total Amount:</strong> ৳${totalPrice}</p>
           <p style="background: #eef2ff; padding: 10px; border-radius: 5px;">
             <strong>Action:</strong> Please check the dashboard to verify the Transaction ID and confirm the order.
           </p>
         </div>`,
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
