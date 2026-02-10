/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { FaArrowRight, FaBagShopping, FaEye } from "react-icons/fa6";
import { motion } from "framer-motion";

const Product = ({ product }) => {
  const discountedPrice =
    product.discountPercentage > 0
      ? product.price - (product.price * product.discountPercentage) / 100
      : product.price;

  const mainImage = Array.isArray(product?.images) && product.images.length > 0 
    ? product.images[0] 
    : product?.image || "/placeholder.jpg";

  const productPath = `/product/${product.slug || product._id}`;

  return (
    <div className="group relative w-full bg-white rounded-[1.5rem] p-3 border border-gray-100 hover:border-blue-100 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] transition-all duration-500 ease-in-out">
      
      {/* 1. Image Container */}
      <div className="relative overflow-hidden rounded-[1.2rem] bg-[#fcfcfc] aspect-[1/1]">
        <Link to={productPath}>
          <motion.img 
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-contain p-4" 
            src={mainImage} 
            alt={product.name} 
          />
        </Link>

        {/* Floating Badges (Blue/Tech Style) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discountPercentage > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-tighter">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Action Icons Overlay (Logo Style Blur) */}
        <div className="absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <Link to={productPath} className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-gray-800 hover:bg-blue-600 hover:text-white transition-all shadow-xl">
            <FaEye size={18} />
          </Link>
          <button className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-gray-800 hover:bg-[#B88E2F] hover:text-white transition-all shadow-xl">
            <FaBagShopping size={18} />
          </button>
        </div>

        {/* Heart Icon (Top Right) */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300">
            <HeartIcon product={product} />
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="px-2 py-4">
        <div className="text-center">
          <span className="text-[9px] font-black text-blue-600/60 uppercase tracking-[0.3em] font-mono">
            {product?.brand || "AriX GeaR"}
          </span>
          <Link to={productPath}>
            <h5 className="text-[15px] font-mono font-bold text-gray-800 mt-1 hover:text-blue-600 transition-colors line-clamp-1">
              {product.name}
            </h5>
          </Link>
        </div>

        {/* Pricing (Logo Colors) */}
        <div className="mt-3 flex flex-col items-center gap-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-gray-900">
              ৳{Math.round(discountedPrice).toLocaleString("en-BD")}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.price.toLocaleString("en-BD")}
              </span>
            )}
          </div>
        </div>

        {/* 3. AriX Style Button (Centered Line) */}
        <div className="mt-4 pt-2 border-t border-gray-50">
          <Link 
            to={productPath}
            className="group/btn flex items-center justify-center gap-2 w-full py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all"
          >
            <span>Details</span>
            <FaArrowRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
            
            {/* Centered Line Animation like Logo/ServiceTag */}
            <div className="absolute bottom-0 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-[#B88E2F] group-hover/btn:w-1/2 transition-all duration-500" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;