import React from "react";
import { motion } from "framer-motion";
import { TbTruckDelivery } from "react-icons/tb";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { BiSupport } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";

const services = [
  {
    title: "Free Delivery",
    subtitle: "Fast shipping on all orders",
    icon: <TbTruckDelivery />,
    color: "group-hover:text-blue-600",
  },
  {
    title: "Returns",
    subtitle: "Money back within 21 days",
    icon: <HiOutlineCurrencyDollar />,
    color: "group-hover:text-[#B88E2F]",
  },
  {
    title: "Support 24/7",
    subtitle: "Ready to help anytime",
    icon: <BiSupport />,
    color: "group-hover:text-blue-600",
  },
  {
    title: "Payments",
    subtitle: "100% secure transactions",
    icon: <MdOutlinePayment />,
    color: "group-hover:text-[#B88E2F]",
  },
];

const ServiceTag = () => {
  return (
    <div className="bg-white py-20 border-y border-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {services.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.15, 
              ease: [0.16, 1, 0.3, 1] // Custom Cubic Bezier for smooth effect
            }}
            className="group flex flex-col items-center text-center space-y-5"
          >
            {/* 🟢 Icon with Dashed Circle (Logo style) */}
            <div className="relative flex items-center justify-center w-20 h-20">
              <motion.div
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full group-hover:border-blue-500/50 transition-colors duration-500"
              />
              <div className={`text-4xl text-gray-800 transition-all duration-500 ${item.color}`}>
                {item.icon}
              </div>
            </div>

            {/* 🟢 Text Content - Centered */}
            <div className="flex flex-col items-center space-y-2">
              <h3 className="text-sm font-mono font-black uppercase tracking-[0.2em] text-gray-900 group-hover:tracking-[0.25em] transition-all duration-500">
                {item.title}
              </h3>
              
              {/* Logo Style Gradient Underline (Centered) */}
              <motion.div 
                className="h-[2px] w-0 bg-gradient-to-r from-blue-600 to-[#B88E2F] group-hover:w-full transition-all duration-700 ease-in-out"
                style={{ originX: 0.5 }} // Center থেকে লাইনটি বড় হবে
              />
              
              <p className="text-xs font-medium text-gray-400 max-w-[200px] leading-relaxed font-sans pt-1">
                {item.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceTag;