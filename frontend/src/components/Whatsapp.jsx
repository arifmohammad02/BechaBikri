import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const Whatsapp = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "bottom-6 right-6" : "bottom-10 right-10"
      }`}
    >
      <a
        href="https://api.whatsapp.com/send?phone=+8801793766634"
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <motion.div
          whileHover={{ width: "160px" }} // মাউস নিলে আস্তে করে বড় হবে
          transition={{ duration: 0.4, ease: "circOut" }}
          className="flex items-center bg-white border border-gray-100 shadow-lg rounded-full h-14 w-14 overflow-hidden p-1"
        >
          {/* WhatsApp Icon Area */}
          <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
            <FaWhatsapp />
          </div>

          {/* Text Area - Hidden by default, slides in on hover */}
          <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none">
              Online
            </p>
            <p className="text-sm font-mono font-bold text-gray-800 tracking-tighter">
              Ari<span className="text-blue-600">X</span> Chat
            </p>
          </div>
        </motion.div>

        {/* ছোট্ট একটা গ্রিন ডট (সজীবতা বোঝাতে) */}
        <span className="absolute top-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
        </span>
      </a>
    </div>
  );
};

export default Whatsapp;