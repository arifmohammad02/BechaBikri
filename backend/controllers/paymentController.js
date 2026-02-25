import PaymentMethod from "../models/paymentMethodModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Get all active payment methods
// @route   GET /api/payments/methods
// @access  Public
const getPaymentMethods = asyncHandler(async (req, res) => {
  const methods = await PaymentMethod.find({ isActive: true }).select("-__v");
  res.json(methods);
});

// @desc    Create or Update payment method
// @route   POST /api/payments/methods
// @access  Admin
const createOrUpdatePaymentMethod = asyncHandler(async (req, res) => {
  const { type, number, accountType, accountName, instructions, icon } =
    req.body;

  if (!type || !number || !accountName) {
    res.status(400);
    throw new Error("Please provide type, number and account name");
  }

  const paymentMethod = await PaymentMethod.findOneAndUpdate(
    { type },
    {
      type,
      number,
      accountType: accountType || "Personal",
      accountName,
      instructions: instructions || "",
      icon: icon || "",
      isActive: true,
    },
    { upsert: true, new: true, runValidators: true },
  );

  res.status(201).json(paymentMethod);
});

// @desc    Delete payment method
// @route   DELETE /api/payments/methods/:type
// @access  Admin
const deletePaymentMethod = asyncHandler(async (req, res) => {
  const method = await PaymentMethod.findOne({ type: req.params.type });

  if (!method) {
    res.status(404);
    throw new Error("Payment method not found");
  }

  method.isActive = false;
  await method.save();

  res.json({ message: "Payment method deactivated" });
});

// @desc    Submit manual payment
// @route   PUT /api/payments/submit/:orderId
// @access  Private
const submitManualPayment = asyncHandler(async (req, res) => {
  const {
    transactionId,
    senderNumber,
    selectedPaymentMethod,
    sentAmount,
    paymentScreenshot,
  } = req.body;
  const { orderId } = req.params;

  if (!transactionId || !senderNumber || !selectedPaymentMethod) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check duplicate Transaction ID
  const existingOrder = await Order.findOne({
    "manualPaymentDetails.transactionId": transactionId.toUpperCase(),
    _id: { $ne: orderId },
  });

  if (existingOrder) {
    res.status(400);
    throw new Error("This Transaction ID has already been used");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Not authorized");
  }

  order.manualPaymentDetails = {
    transactionId: transactionId.toUpperCase(),
    senderNumber,
    selectedPaymentMethod,
    sentAmount: Number(sentAmount) || order.totalPrice,
    paymentScreenshot: paymentScreenshot || "",
  };

  order.paymentStatus = "awaiting_verification";

  await order.save();

  // Notify Admin
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Payment Verification Required",
      html: `
        <h2>New Manual Payment Submitted</h2>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Amount:</strong> ৳${order.totalPrice}</p>
        <p><strong>Method:</strong> ${selectedPaymentMethod}</p>
        <p><strong>Transaction ID:</strong> ${transactionId.toUpperCase()}</p>
        <p><strong>From:</strong> ${senderNumber}</p>
        <a href="${process.env.FRONTEND_URL}/admin/orderlist" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none;">Verify Now</a>
      `,
    });
  } catch (error) {
    console.error("Admin email failed:", error);
  }

  res.json({
    message: "Payment details submitted successfully",
    order,
  });
});

// @desc    Verify manual payment
// @route   PUT /api/payments/verify/:orderId
// @access  Admin
const verifyManualPayment = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const { orderId } = req.params;

  if (!["paid", "failed"].includes(status)) {
    res.status(400);
    throw new Error("Status must be 'paid' or 'failed'");
  }

  const order = await Order.findById(orderId).populate(
    "user",
    "username email",
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (status === "paid") {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentStatus = "paid";
    order.paymentVerifiedBy = req.user._id;
    order.paymentVerifiedAt = new Date();
    order.paymentVerificationNotes = notes || "";
    order.isDelivered = "Processing";
  } else {
    order.paymentStatus = "failed";
    order.paymentVerificationNotes = notes || "Verification failed";
  }

  await order.save();

  // Send email to customer
  const emailSubject =
    status === "paid"
      ? "Payment Verified - Order Confirmed"
      : "Payment Verification Failed";
  const emailHtml =
    status === "paid"
      ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Payment Verified!</h2>
        <p>Dear ${order.user.username},</p>
        <p>Your payment for order <strong>#${order.orderId}</strong> has been verified.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount:</strong> ৳${order.totalPrice}</p>
          <p><strong>Transaction ID:</strong> ${order.manualPaymentDetails?.transactionId}</p>
        </div>
        <p>Your order is now being processed.</p>
      </div>
    `
      : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Payment Failed</h2>
        <p>Dear ${order.user.username},</p>
        <p>We couldn't verify your payment for order <strong>#${order.orderId}</strong>.</p>
        <p><strong>Reason:</strong> ${notes || "Invalid transaction"}</p>
      </div>
    `;

  try {
    await sendEmail({
      to: order.user.email,
      subject: emailSubject,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Customer email failed:", error);
  }

  res.json({
    message: `Payment ${status === "paid" ? "verified" : "rejected"}`,
    order,
  });
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Admin
const getPaymentStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $match: {
        paymentMethod: { $in: ["bKash", "Nagad", "Rocket", "Bank"] },
      },
    },
    {
      $group: {
        _id: "$paymentMethod",
        totalAmount: { $sum: "$totalPrice" },
        count: { $sum: 1 },
        pending: {
          $sum: {
            $cond: [{ $eq: ["$paymentStatus", "awaiting_verification"] }, 1, 0],
          },
        },
        verified: {
          $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
        },
        failed: {
          $sum: { $cond: [{ $eq: ["$paymentStatus", "failed"] }, 1, 0] },
        },
      },
    },
  ]);

  const overall = await Order.aggregate([
    {
      $match: {
        paymentMethod: { $in: ["bKash", "Nagad", "Rocket", "Bank"] },
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalTransactions: { $sum: 1 },
      },
    },
  ]);

  res.json({
    byMethod: stats,
    overall: overall[0] || { totalRevenue: 0, totalTransactions: 0 },
  });
});

export {
  getPaymentMethods,
  createOrUpdatePaymentMethod,
  deletePaymentMethod,
  submitManualPayment,
  verifyManualPayment,
  getPaymentStats,
};
