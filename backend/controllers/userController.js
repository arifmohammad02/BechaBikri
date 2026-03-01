import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// Create user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // ১. ভ্যালিডেশন
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please enter a valid email");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  // ২. ইউজার আগে থেকে আছে কি না চেক
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // ৩. OTP এবং পাসওয়ার্ড হ্যাশিং
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // ১০ মিনিট মেয়াদ

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // ৪. নতুন ইউজার অবজেক্ট তৈরি
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    otp,
    otpExpires,
  });

  try {
    // ৫. ডাটাবেজে সেভ করা (ইমেইল পাঠানোর আগে সেভ করা ভালো)
    await newUser.save();

    // ৬. ইমেইল পাঠানো
    const message = `Your verification code is: ${otp}`;
    await sendEmail({
      to: newUser.email,
      subject: "Verify Your Account",
      text: message,
      html: `<h1>Welcome ${username}!</h1><p>Your OTP code is: <strong>${otp}</strong></p>`,
    });

    // ৭. রেসপন্স পাঠানো (এখানে createToken কল করবেন না)
    res.status(201).json({
      message: "Registration successful. Please check your email for the OTP.",
      email: newUser.email,
    });
  } catch (error) {
    console.error("Error in Registration:", error.message);
    res.status(500);
    throw new Error("Registration failed or Email could not be sent.");
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  if (user.otp === otp && user.otpExpires > Date.now()) {
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = createToken(res, user._id); // Now they get the cookie

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("This account is already verified.");
  }

  // নতুন OTP তৈরি
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const newOtpExpires = Date.now() + 10 * 60 * 1000;

  user.otp = newOtp;
  user.otpExpires = newOtpExpires;
  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: "Resend OTP - Verify Your Account",
      text: `Your new verification code is: ${newOtp}`,
      html: `<h1>Your New OTP: <strong>${newOtp}</strong></h1><p>Expires in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to resend OTP. Try again.");
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!existingUser.isVerified) {
    res.status(401);
    throw new Error("Your account is not verified. Please check your email.");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // ✅ একবারই token তৈরি করুন
  const token = createToken(res, existingUser._id);

  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    isVerified: existingUser.isVerified,
    token: token, // ✅ Frontend-এ store করার জন্য
  });
});


// @desc    Forgot Password - রিসেট টোকেন তৈরি ও ইমেইল পাঠানো
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const otp = user.createPasswordResetOTP();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: `<h3>Your Password Reset OTP is: <strong>${otp}</strong></h3>
             <p>This code will expire in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error("Email could not be sent");
  }
});

// @desc    Verify OTP for Password Reset
const verifyResetOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // ওটিপি হ্যাস করা (যেহেতু ডাটাবেজে হ্যাস করে রাখা হয়েছে)
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordOTP: hashedOtp,
    resetPasswordExpires: { $gt: Date.now() }, // মেয়াদ চেক করা
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  // ওটিপি সঠিক হলে একটি সাকসেস মেসেজ পাঠানো
  res
    .status(200)
    .json({ message: "OTP verified. Now you can reset your password." });
});

// @desc    Reset Password - নতুন পাসওয়ার্ড সেভ করা
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;

  // কাজ শেষ হলে ওটিপি ফিল্ডগুলো ক্লিয়ার করে দেওয়া
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful!" });
});

// Logout user

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
});

// Get all users

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Get current user profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update current user profile

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Delete user by id

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Get user by id

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update user by id

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  verifyEmail,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
