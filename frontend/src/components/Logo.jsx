/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const Logo = ({ className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className={`flex items-center gap-2 cursor-pointer group ${className}`}
    >
      {/* Logo Icon (A + X) - Mobile-e size komano hoyeche */}
      <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full border-2 border-dashed border-blue-500 rounded-full"
        ></motion.div>
        <span className="text-xl sm:text-2xl font-black text-blue-600 z-10 font-mono tracking-tighter">
          A<span className="text-[#B88E2F]">X</span>
        </span>
      </div>

      {/* Brand Name - Mobile-e text size and spacing fix */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center whitespace-nowrap">
          <span className="text-xl sm:text-2xl font-extrabold font-mono tracking-tighter text-blue-600">
            Ari<span className="text-[#B88E2F]">X</span>
          </span>
          <span className="text-xl sm:text-2xl font-black font-serif text-[#B88E2F] ml-1">
            GeaR
          </span>
        </div>

        {/* Dynamic Underline */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-[2px] bg-gradient-to-r from-blue-600 to-[#B88E2F]"
        ></motion.div>

        {/* Tagline - Mobile-e aro chhoto kora hoyeche */}
        <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 whitespace-nowrap">
          Gadget & Tech
        </span>
      </div>
    </motion.div>
  );
};

export default Logo;