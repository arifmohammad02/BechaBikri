// --- Imports ---
import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

// config
import connectDB from "./config/db.js";
import connectCloudunary from "./config/cloudinary.js";
import { startNotificationCleanupJob } from "./jobs/notificationCleanup.js";

// routes
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";


// --- Initializations ---
dotenv.config();
connectDB();
connectCloudunary();
startNotificationCleanupJob();

const app = express(); // ১. আগে app তৈরি করতে হবে
const httpServer = createServer(app); // ২. তারপর httpServer তৈরি হবে
const port = process.env.PORT || 8000;
const HOST = "0.0.0.0";

// --- Socket.io Setup ---
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("authenticate", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} is online.`);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`❌ User ${userId} disconnected.`);
        break;
      }
    }
  });
});

// ৩. app.set সকেটের পরে করতে হবে
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Routes ---
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// --- Static Files & Production Setup ---
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "production") {
  console.log("Production mode active: Serving Frontend...");
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")),
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// ৪. app.listen এর জায়গায় httpServer.listen ব্যবহার করুন
httpServer.listen(port, () => {
 console.log(`🚀 Server running on http://${HOST}:${port}`);
});

export { io, onlineUsers };
