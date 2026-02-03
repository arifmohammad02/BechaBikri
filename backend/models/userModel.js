// Import Mongoose
import mongoose from "mongoose";
import crypto from "crypto";

// Create the user schema
const usersSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: { type: Boolean, default: false },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },

    resetPasswordOTP: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },

    verificationTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true },
); // Add timestamps to the schema

// 🛠️ পাসওয়ার্ড রিসেট তৈরির টোকেন মেথড
usersSchema.methods.createPasswordResetOTP = function () {
  // ১. একটি ৬-ডিজিটের ওটিপি তৈরি করা
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ২. ওটিপি-টি হ্যাস করে ডাটাবেজে রাখা (নিরাপত্তার জন্য)
  this.resetPasswordOTP = crypto.createHash("sha256").update(otp).digest("hex");

  // ৩. মেয়াদ ১০ মিনিট সেট করা
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return otp; // মেইল পাঠানোর জন্য আসল ওটিপি রিটার্ন করা
};
// Create the user model
const User = mongoose.model("User", usersSchema);

// Export the user model
export default User;
