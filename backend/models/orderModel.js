import mongoose from "mongoose";
import shortid from "shortid";

const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      default: shortid.generate,
      unique: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },

    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        discountPercentage: { type: Number, default: 0 },
        offer: { type: String, default: "" },
        weight: { type: Number, default: 0 },
        shippingDetails: {
          shippingType: { type: String },
          fixedShippingCharge: { type: Number },
          freeShippingThreshold: { type: Number },
          insideDhakaCharge: { type: Number },
          outsideDhakaCharge: { type: Number },
          isFreeShippingActive: { type: Boolean, default: false },
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        variantInfo: {
          hasVariants: { type: Boolean, default: false },
          colorIndex: { type: Number, default: null },
          colorName: { type: String, default: "" },
          colorHex: { type: String, default: "" },
          sizeIndex: { type: Number, default: null },
          sizeName: { type: String, default: "" },
          variantPrice: { type: Number, default: null }, // Price at time of order
          sku: { type: String, default: "" },
        },
      },
    ],

    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      // shippingCharge: { type: Number, default: 0 },
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash on Delivery", "bKash", "Nagad", "Rocket", "Bank"],
    },

    manualPaymentDetails: {
      transactionId: {
        type: String,
        unique: true,
        sparse: true, // অন্যান্য পেমেন্ট মেথডের জন্য null allow করবে
        trim: true,
        uppercase: true,
      },
      senderNumber: { type: String, trim: true },
      paymentScreenshot: { type: String }, // Cloudinary URL
      selectedPaymentMethod: {
        type: String,
        enum: ["bKash", "Nagad", "Rocket", "Bank"],
      },
      sentAmount: { type: Number },
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    paymentStatus: {
      type: String,
      enum: [
        "paid",
        "due",
        "pending",
        "failed",
        "awaiting_verification",
        "refunded",
      ],
      default: function () {
        if (["bKash", "Nagad", "Rocket", "Bank"].includes(this.paymentMethod)) {
          return "awaiting_verification";
        }
        return this.paymentMethod === "Cash on Delivery" ? "due" : "pending";
      },
    },

    paymentVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    paymentVerifiedAt: { type: Date },
    paymentVerificationNotes: { type: String },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    isDelivered: {
      type: String,
      enum: [
        "Order Placed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Order Placed",
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index(
  { "manualPaymentDetails.transactionId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "manualPaymentDetails.transactionId": { $exists: true },
    },
  },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
