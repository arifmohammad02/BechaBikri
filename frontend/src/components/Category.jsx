/* eslint-disable react/prop-types */
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFolder, FaImage, FaSpinner } from "react-icons/fa";

// 🎯 Category Item Skeleton
const CategorySkeleton = ({ index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      {/* Image Container Skeleton */}
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        {/* Rotating Border */}
        <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-[2rem] animate-pulse" />
        
        {/* Inner Circle */}
        <div className="absolute inset-2 rounded-[1.8rem] bg-gray-100 border border-gray-200 flex items-center justify-center">
          <FaImage className="text-gray-300 text-2xl" />
        </div>
      </div>

      {/* Name Skeleton */}
      <div className="w-16 h-4 bg-gray-200 rounded mt-5 animate-pulse" />
      
      {/* Dot Skeleton */}
      <div className="w-1 h-1 bg-gray-200 rounded-full mt-1" />
    </motion.div>
  );
};

// 🎯 Section Header Skeleton
const HeaderSkeleton = () => (
  <div className="flex flex-col items-center mb-12">
    <div className="text-center space-y-3">
      {/* Small Label */}
      <div className="w-24 h-3 bg-blue-200 rounded mx-auto animate-pulse" />
      
      {/* Main Title */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-32 h-8 bg-gray-300 rounded animate-pulse" />
        <div className="w-24 h-8 bg-[#B88E2F]/20 rounded animate-pulse" />
      </div>
      
      {/* Gradient Line */}
      <div className="flex justify-center pt-2">
        <div className="h-[3px] w-12 bg-gradient-to-r from-blue-200 to-[#B88E2F]/20 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

// 🎯 Loading State Component
const LoadingState = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <HeaderSkeleton />
      
      {/* Categories Grid Skeleton */}
      <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <CategorySkeleton key={index} index={index} />
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
          <FaSpinner className="animate-spin text-blue-600" />
          <span className="text-sm text-blue-600 font-medium">Loading categories...</span>
        </div>
      </div>
    </div>
  );
};

// 🎯 Error State Component
const ErrorState = () => (
  <div className="container mx-auto py-16 px-4">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <FaFolder className="text-red-500 text-2xl" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Failed to Load Categories</h3>
      <p className="text-gray-500 text-sm">Please try refreshing the page</p>
    </div>
  </div>
);

// 🎯 Empty State Component
const EmptyState = () => (
  <div className="container mx-auto py-16 px-4">
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FaFolder className="text-gray-400 text-2xl" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">No Categories Found</h3>
      <p className="text-gray-500 text-sm">Check back later for new categories</p>
    </div>
  </div>
);

const Category = () => {
  const { data, error, isLoading } = useFetchCategoriesQuery();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <EmptyState />;
  }

  // Only show Main Categories
  const mainCategories = data.filter((c) => {
    const parentId = c.parent && typeof c.parent === "object" ? c.parent._id : c.parent;
    return !parentId;
  });

  return (
    <div className="container mx-auto py-16 px-4">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-blue-600 font-mono font-bold tracking-[0.4em] uppercase text-[10px]">
            Browse by
          </span>
          <h2 className="text-3xl md:text-4xl font-mono font-black text-[#212B36] mt-2 mb-3 tracking-tighter">
            Featured <span className="text-[#B88E2F]">Category</span>
          </h2>
          <div className="flex justify-center">
            <div className="h-[3px] w-12 bg-gradient-to-r from-blue-600 to-[#B88E2F] rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Category Grid */}
      <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
        {mainCategories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/shop?category=${category._id}`}
              className="group flex flex-col items-center"
            >
              {/* Category Image Container */}
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <div className="absolute inset-0 border-2 border-dashed border-blue-200 rounded-[2rem] group-hover:rotate-45 group-hover:border-blue-500 transition-all duration-700" />

                <div className="absolute inset-2 overflow-hidden rounded-[1.8rem] bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-500">
                  <img
                    src={category.image || "/placeholder.jpg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-600/10 transition-all duration-300" />
                </div>
              </div>

              <h4 className="text-[14px] font-trebuchet text-[#212B36] font-black mt-5 text-center capitalize group-hover:text-blue-600 transition-colors">
                {category.name}
              </h4>

              <div className="w-1 h-1 bg-[#B88E2F] rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Category;