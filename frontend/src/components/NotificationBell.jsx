import { useState, useEffect, useRef } from "react";
import { LuBell, LuBellRing, LuTrash2, LuInbox, LuCheckCircle } from "react-icons/lu"; // মডার্ন আইকন
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "../redux/api/notificationApiSlice";

import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion"; // অ্যানিমেশনের জন্য
import { FaTimes } from "react-icons/fa";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { data, isLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkAsReadMutation();
  const [markAllRead] = useMarkAllAsReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  const unreadCount = data?.stats?.unread || 0;
  const notifications = data?.data || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notification) => {
    try {
      if (!notification.isRead) {
        await markRead(notification._id).unwrap();
      }
      setIsOpen(false);
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      } else if (notification.type === "order") {
        navigate("/user-orders");
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🟢 ১. বেল আইকন ডিজাইন (Premium Look) */}
      <button
        className={`relative p-2.5 rounded-xl transition-all duration-500 group border ${
          isOpen ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-600 hover:border-red-200"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {unreadCount > 0 ? (
          <LuBellRing className={`text-xl ${isOpen ? "text-red-500" : "text-gray-800 animate-swing"}`} />
        ) : (
          <LuBell className="text-xl" />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center h-5 w-5 text-[9px] font-black text-white bg-red-600 rounded-full border-2 border-white">
              {unreadCount > 99 ? "9" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* 🟢 ২. ড্রপডাউন মেনু (With Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-4 top-[70px] mx-auto sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-4 w-auto sm:w-[380px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[999] overflow-hidden"
          >
            {/* হেডার */}
            <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-50">
              <h3 className="font-mono font-black text-xs uppercase tracking-[0.2em] text-gray-800">
                Notifications
              </h3>
              <div className="flex items-center gap-4">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="text-[10px] font-mono font-black uppercase text-red-600 hover:text-black transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="sm:hidden text-gray-400">
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* লিস্ট */}
            <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto scrollbar-hide">
              {isLoading ? (
                <div className="p-12 text-center font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                  Decrypting Data...
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <motion.div
                      key={n._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`group relative p-5 flex flex-col gap-1 transition-all cursor-pointer ${
                        !n.isRead ? "bg-red-50/40 hover:bg-red-50/70" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleMarkAsRead(n)}
                    >
                      {/* আনরিড ডট */}
                      {!n.isRead && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-600 rounded-full" />
                      )}

                      <div className="flex justify-between items-start pr-6">
                        <h5 className={`text-sm tracking-tight ${!n.isRead ? "font-black text-gray-900" : "font-bold text-gray-500"}`}>
                          {n.title}
                        </h5>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotif(n._id);
                          }}
                          className="absolute top-5 right-4 p-1.5 text-gray-300 hover:text-red-600 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                      
                      <p className={`text-xs leading-relaxed line-clamp-2 ${!n.isRead ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                        {n.message}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-tighter">
                          {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ""}
                        </span>
                        {!n.isRead && <span className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center">
                  <LuInbox className="text-gray-100 w-16 h-16 mb-4" />
                  <p className="text-[10px] font-mono font-black text-gray-300 uppercase tracking-[0.2em]">Zero Alerts Found</p>
                </div>
              )}
            </div>

            {/* ফুটার */}
            <Link
              to="/all-notifications"
              className="group block w-full py-5 text-center bg-black text-white hover:bg-red-600 transition-all duration-500"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                Open Command Center <LuCheckCircle className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;