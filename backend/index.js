// packages
import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

// routes
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";

// utils
import connectDB from "./config/db.js";
import connectCloudunary from "./config/cloudinary.js";
import { startNotificationCleanupJob } from "./jobs/notificationCleanup.js";

// configuration
dotenv.config();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();

// connect to database & jobs
connectDB();
connectCloudunary();
startNotificationCleanupJob();

// create express app
const app = express();

// create http server
const httpServer = createServer(app);

// socket.io setup
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

// app settings
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes setup
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/banners", bannerRoutes);

// static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// listen
httpServer.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});

export { io, onlineUsers };
