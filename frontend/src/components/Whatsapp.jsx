import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

const Whatsapp = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [unread, setUnread] = useState(2);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e) => {
    setUnread(0); // Reset unread on click
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isScrolled ? "bottom-5 right-5" : "bottom-10 right-10"
      }`}
    >
      {/* WhatsApp Button Card */}
      <div className="relative group">
        <a
          href="https://api.whatsapp.com/send?phone=+8801793-766634&text=Hello"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex items-center bg-white shadow-xl rounded-lg p-3 space-x-3 hover:shadow-2xl transition-shadow duration-300"
        >
          {/* WhatsApp Icon */}
          <div
            className={`p-3 rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <FaWhatsapp className="text-white text-2xl" />
          </div>

          {/* Text and Status */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              Chat with us
            </span>
            <span
              className={`text-xs ${
                isOnline ? "text-green-500" : "text-gray-500"
              }`}
            >
              {isOnline ? "We're online!" : "We're offline"}
            </span>
          </div>

          {/* Unread Notification */}
          {unread > 0 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unread}
            </div>
          )}
        </a>

        {/* Hover Tooltip */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-3 py-2 rounded-md text-sm opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible">
          Click to chat!
        </div>
      </div>
    </div>
  );
};

export default Whatsapp;
