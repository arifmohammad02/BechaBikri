import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Create the user schema
const usersSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Email verification OTP
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    // Password reset OTP
    resetPasswordOTP: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    // Alternative verification token (optional)
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ⭐ Index creation for faster queries
usersSchema.index({ email: 1 });
usersSchema.index({ username: 1 });

// ⭐ Password match method (Login-এ ব্যবহার হয়)
usersSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ⭐ Password reset OTP create method
usersSchema.methods.createPasswordResetOTP = function () {
  // 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP for security
  this.resetPasswordOTP = crypto.createHash("sha256").update(otp).digest("hex");

  // 10 minutes expiry
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return otp; // Return plain OTP for email
};

// ⭐ Email verification OTP create method
usersSchema.methods.createEmailVerificationOTP = function () {
  // 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.otp = otp; // Plain OTP (আপনার আগের logic অনুযায়ী)
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return otp;
};

// ⭐ Verify password reset OTP method
usersSchema.methods.verifyPasswordResetOTP = function (enteredOTP) {
  const hashedOTP = crypto
    .createHash("sha256")
    .update(enteredOTP)
    .digest("hex");

  return (
    this.resetPasswordOTP === hashedOTP &&
    this.resetPasswordExpires > Date.now()
  );
};

// ⭐ Clear password reset fields
usersSchema.methods.clearPasswordReset = function () {
  this.resetPasswordOTP = undefined;
  this.resetPasswordExpires = undefined;
};

// Create the user model
const User = mongoose.model("User", usersSchema);

// Export the user model
export default User;
