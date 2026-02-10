import { io } from "socket.io-client";

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    // যদি আগে থেকেই কানেক্টেড থাকে, তবে নতুন কানেকশন এড়াতে এই চেক
    if (this.socket && this.socket.connected) return;

    /**
     * যেহেতু Vite Config-এ প্রক্সি সেট করা আছে,
     * তাই সরাসরি "/" দিলে এটি অটোমেটিক ব্যাকেন্ডের (8000 পোর্ট) সাথে কানেক্ট হবে।
     */
    this.socket = io("/", {
      withCredentials: true,
      transports: ["websocket"], // HTTP Polling এড়াতে সরাসরি websocket ব্যবহার
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log(`📡 WebSocket Connected. ID: ${this.socket.id}`);
      // কানেক্ট হওয়ার পর ইউজারকে অথেন্টিকেট করা
      this.socket.emit("authenticate", userId);
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Socket Disconnected. Reason:", reason);
    });
  }

  // রিয়েল-টাইম নোটিফিকেশন লিসেনার
  onNotification(callback) {
    if (this.socket) {
      // ডুপ্লিকেট লিসেনার এড়াতে আগে 'off' করা জরুরি
      this.socket.off("new-notification");
      this.socket.on("new-notification", (data) => {
        callback(data);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🛑 WebSocket Manually Disconnected");
    }
  }
}

export default new WebSocketService();
