import { Link } from "react-router-dom";
import { useGetFlashSaleProductsQuery } from "../../redux/api/productApiSlice";
import Product from "../../pages/Products/Product";
import Message from "../Message";
import { 
  FaLongArrowAltRight, 
  FaFire,
  FaBolt,
  FaClock,
  FaPercentage
} from "react-icons/fa";
import { motion } from "framer-motion";

// 🎯 Product Skeleton Component
const ProductSkeleton = () => {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden border border-red-100 shadow-sm h-full flex flex-col">
      {/* Flash Sale Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
          <div className="w-10 h-2 bg-red-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Timer Badge */}
      <div className="absolute top-2 right-2 z-10">
        <div className="bg-gray-900 text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
          <FaClock className="text-gray-400" />
          <div className="w-12 h-2 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FaBolt className="text-red-200 text-4xl" />
        </div>
        
        {/* Big Discount Badge */}
        <div className="absolute bottom-2 left-2 w-14 h-6 bg-red-500 rounded-lg animate-pulse flex items-center justify-center">
          <FaPercentage className="text-red-300 text-xs" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 flex flex-col flex-grow space-y-2">
        {/* Brand */}
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
        
        {/* Title */}
        <div className="w-full h-4 bg-gray-300 rounded animate-pulse" />
        <div className="w-2/3 h-4 bg-gray-300 rounded animate-pulse" />
        
        {/* Flash Progress Bar */}
        <div className="w-full h-2 bg-red-100 rounded-full mt-1 overflow-hidden">
          <div className="h-full bg-red-300 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
        <div className="w-20 h-2 bg-red-100 rounded animate-pulse" />

        {/* Price Section - Flash Sale Style */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="w-16 h-5 bg-red-500 rounded animate-pulse" />
          <div className="w-14 h-4 bg-gray-300 rounded line-through animate-pulse" />
          <div className="w-10 h-4 bg-red-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// 🎯 Countdown Timer Skeleton
const CountdownSkeleton = () => (
  <div className="flex items-center gap-2 mb-4">
    <div className="flex items-center gap-1">
      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
      <span className="text-gray-400 font-bold">:</span>
      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
      <span className="text-gray-400 font-bold">:</span>
      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
    </div>
    <div className="w-16 h-4 bg-red-100 rounded-full animate-pulse" />
  </div>
);

// 🎯 Section Header Skeleton
const HeaderSkeleton = () => (
  <div className="flex flex-col items-center mb-6">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-4 h-4 bg-red-200 rounded-full animate-pulse" />
      <div className="w-20 h-4 bg-red-200 rounded animate-pulse" />
      <div className="w-4 h-4 bg-red-200 rounded-full animate-pulse" />
    </div>
    
    <div className="w-40 h-7 bg-gray-300 rounded-lg mb-2 animate-pulse" />
    
    <div className="w-12 h-1 bg-red-200 rounded-full mb-4 animate-pulse" />
    
    <CountdownSkeleton />
  </div>
);

// 🎯 View All Button Skeleton
const ButtonSkeleton = () => (
  <div className="flex justify-center mt-6">
    <div className="w-36 h-10 bg-gradient-to-r from-red-200 to-orange-200 rounded-lg animate-pulse" />
  </div>
);

const FlashSale = () => {
  const { data: products, isLoading, isError } = useGetFlashSaleProductsQuery(10);

  // 🎯 Skeleton Loading State
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50" style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
        <div className="container mx-auto px-4">
          <HeaderSkeleton />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <ProductSkeleton />
              </motion.div>
            ))}
          </div>

          <ButtonSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50" style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
      <div className="container mx-auto px-4">
        
        {/* Header - Compact */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FaFire className="text-red-500 animate-pulse" />
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider bg-red-100 px-3 py-1 rounded-full">
              Flash Sale
            </span>
            <FaFire className="text-red-500 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Deals of the Day
          </h2>
          
          <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-4" />
        </div>

        {/* Products Grid */}
        {isError ? (
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products?.slice(0, 10).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Product product={product} />
                </motion.div>
              ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-6">
              <Link to="/shop?flashsale=true">
                <button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:from-gray-900 hover:to-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  View All Deals
                  <FaLongArrowAltRight />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FlashSale;