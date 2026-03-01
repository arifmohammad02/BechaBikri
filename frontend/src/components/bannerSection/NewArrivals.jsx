/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useGetNewArrivalsQuery } from "../../redux/api/productApiSlice";
import Product from "../../pages/Products/Product";
import Message from "../Message";
import { 
  FaLongArrowAltRight, 
  FaStar, 
  FaClock,
  FaShoppingBag
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 🎯 Product Skeleton Component
const ProductSkeleton = ({ isNew = true }) => {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col">
      {/* New Badge Skeleton */}
      {isNew && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-300 rounded-full animate-pulse" />
            <div className="w-8 h-2 bg-amber-200 rounded animate-pulse" />
          </div>
        </div>
      )}

      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FaShoppingBag className="text-gray-300 text-4xl" />
        </div>
        
        {/* Discount Badge Skeleton */}
        <div className="absolute top-2 right-2 w-12 h-5 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="p-3 flex flex-col flex-grow space-y-2">
        {/* Brand */}
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
        
        {/* Title */}
        <div className="w-full h-4 bg-gray-300 rounded animate-pulse" />
        <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse" />
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
          ))}
          <div className="w-8 h-3 bg-gray-200 rounded ml-1 animate-pulse" />
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="w-20 h-5 bg-gray-300 rounded animate-pulse" />
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Date Badge */}
        <div className="w-20 h-3 bg-amber-100 rounded mt-1 animate-pulse" />
      </div>
    </div>
  );
};

// 🎯 Section Header Skeleton
const HeaderSkeleton = () => (
  <div className="flex flex-col items-center mb-10">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-4 h-4 bg-amber-200 rounded-full animate-pulse" />
      <div className="w-24 h-4 bg-amber-200 rounded animate-pulse" />
      <div className="w-4 h-4 bg-amber-200 rounded-full animate-pulse" />
    </div>
    
    <div className="w-40 h-8 bg-gray-300 rounded-lg mb-4 animate-pulse" />
    
    <div className="flex items-center gap-2 mb-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
      <FaClock className="text-gray-300" />
      <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
    </div>

    <div className="w-20 h-1 bg-amber-200 rounded-full animate-pulse" />
  </div>
);

// 🎯 View All Button Skeleton
const ButtonSkeleton = () => (
  <div className="flex justify-center mt-10">
    <div className="w-52 h-12 bg-gray-300 rounded-lg animate-pulse border-2 border-gray-200" />
  </div>
);

const NewArrivals = () => {
  const { data: products, isLoading, isError } = useGetNewArrivalsQuery(10);
  const [bdTime, setBdTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      setBdTime(now.toLocaleString("en-US", { 
        timeZone: "Asia/Dhaka",
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // 🎯 Skeleton Loading State
  if (isLoading) {
    return (
      <section className="py-12 bg-white" style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
        <div className="container mx-auto px-4">
          <HeaderSkeleton />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductSkeleton isNew={true} />
              </motion.div>
            ))}
          </div>

          <ButtonSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white" style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
      <div className="container mx-auto px-4">
        
        {/* Header - Same Style */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-3">
            <FaStar className="text-amber-500 text-lg" />
            <span className="text-amber-600 font-bold text-sm uppercase tracking-wider">New Arrivals</span>
            <FaStar className="text-amber-500 text-lg" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Just Landed</h2>

          {/* BD Time - Same Style */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <FaClock className="text-gray-400" />
            <span>{bdTime} (BD Time)</span>
          </div>

          <div className="w-20 h-1 bg-amber-500 rounded-full" />
        </div>

        {/* 5 Column Grid */}
        {isError ? (
          <Message variant="danger">{isError?.data?.message || isError.error}</Message>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products?.slice(0, 10).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Product product={product} />
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link to="/shop?sort=newest">
                <button className="flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-900 hover:text-white transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  View All New Arrivals <FaLongArrowAltRight />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;