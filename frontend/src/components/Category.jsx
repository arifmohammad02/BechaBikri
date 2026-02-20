import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // অ্যানিমেশনের জন্য

const Category = () => {
  const { data, error, isLoading } = useFetchCategoriesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 font-mono">
        Failed to load categories.
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 font-mono">
        No categories found.
      </div>
    );
  }

  // --- UPDATE START: Only show Main Categories in the Grid ---
  const mainCategories = data.filter((c) => {
    const parentId = c.parent && typeof c.parent === "object" ? c.parent._id : c.parent;
    return !parentId;
  });
  // --- UPDATE END ---

  return (
    <div className="container mx-auto py-16 px-4">
      {/* 🟢 Section Header */}
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
            Smart <span className="text-[#B88E2F]">Categories</span>
          </h2>
          {/* Signature Gradient Line */}
          <div className="flex justify-center">
            <div className="h-[3px] w-12 bg-gradient-to-r from-blue-600 to-[#B88E2F] rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* 🟢 Category Grid */}
      <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap">
        {/* --- UPDATE START: Using mainCategories instead of data --- */}
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
              <div className="relative w-28 h-28 md:w-36 md:h-36">
                {/* Rotating Border on Hover */}
                <div className="absolute inset-0 border-2 border-dashed border-blue-200 rounded-[2rem] group-hover:rotate-45 group-hover:border-blue-500 transition-all duration-700" />

                <div className="absolute inset-2 overflow-hidden rounded-[1.8rem] bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img
                    src={category.image || "/placeholder.jpg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-600/10 transition-all duration-300" />
                </div>
              </div>

              {/* Category Name */}
              <h4 className="text-[13px] md:text-[15px] font-mono text-[#212B36] font-black mt-5 text-center uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                {category.name}
              </h4>

              {/* Small dot below name */}
              <div className="w-1 h-1 bg-[#B88E2F] rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        ))}
        {/* --- UPDATE END --- */}
      </div>
    </div>
  );
};

export default Category;