/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const FooterBottom = () => {
  const currentYear = new Date().getFullYear();
  const letters = [
    { char: "A", top: "10%", left: "5%" },
    { char: "X", top: "50%", left: "80%" },
    { char: "G", top: "20%", left: "40%" },
    { char: "R", top: "60%", left: "15%" },
  ];

  return (
    <div className="relative bg-[#fcfcfc] py-8 overflow-hidden border-t border-gray-50">
      
      {/* লোগোর কালারের সাথে মিল রেখে ফ্লোটিং লেটারস */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {letters.map((item, i) => (
          <motion.span
            key={i}
            animate={{ 
              opacity: [0.01, 0.04, 0.01],
              y: [0, -20, 0],
              rotate: [0, 20, 0]
            }}
            transition={{ duration: 10 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute font-mono font-black text-blue-900 text-8xl opacity-5"
            style={{ top: item.top, left: item.left, filter: "blur(3px)" }}
          >
            {item.char}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
        {/* লোগোর নিচের গ্রেডিয়েন্টের সাথে মিল রেখে লাইন */}
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          className="h-[2px] bg-gradient-to-r from-blue-600 to-[#B88E2F] mb-4"
        />

        <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.3em] text-gray-400 text-center">
          &copy; {currentYear} <span className="text-blue-600">AriX</span> <span className="text-[#B88E2F]">GeaR</span>. 
          Elevating Technology.
        </p>
      </div>
    </div>
  );
};

export default FooterBottom;