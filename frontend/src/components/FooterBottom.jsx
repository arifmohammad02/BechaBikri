import { motion } from "framer-motion";

const FooterBottom = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="relative bg-white py-8 overflow-hidden border-t border-gray-100" style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Animated Line */}
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-blue-600 to-amber-500 rounded-full mb-2"
          />

          {/* Copyright Text */}
          <p className="text-sm font-bold text-gray-400 text-center tracking-wide">
            &copy; {currentYear}{" "}
            <span className="text-blue-600">AriX</span>{" "}
            <span className="text-amber-500">GeaR</span>
            . All rights reserved.
          </p>
          
          <p className="text-xs text-gray-300 font-medium tracking-widest uppercase">
            Elevating Technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;