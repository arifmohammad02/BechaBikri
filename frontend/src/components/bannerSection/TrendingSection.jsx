// components/home/TrendingSection.jsx
import { useGetTrendingProductsQuery } from "../../redux/api/productApiSlice";
import { motion } from "framer-motion";
import { FaArrowTrendUp, FaEye, FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Product from "../../pages/Products/Product";

const TrendingSection = () => {
  const { data: products, isLoading } = useGetTrendingProductsQuery();

  if (isLoading || !products?.length) return null;

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-16"
        >
          <div className="text-center md:text-left">
            <span className="inline-flex items-center justify-center md:justify-start gap-2 text-purple-600 font-mono font-bold tracking-[0.4em] uppercase text-xs mb-4">
              <FaArrowTrendUp className="animate-bounce" /> Viral Now
            </span>
            <h2 className="text-3xl md:text-5xl font-mono font-black text-[#212B36] tracking-tighter">
              Trending <span className="text-purple-600">Now</span>
            </h2>
            <div className="flex justify-center md:justify-start mt-4">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 1 }}
                className="h-[3px] bg-gradient-to-r from-purple-600 to-[#B88E2F] rounded-full"
              />
            </div>
          </div>
          
          <p className="text-gray-500 max-w-md mt-4 md:mt-0 text-center md:text-right font-figtree">
            What&lsquo;s hot right now. Join thousands of others checking out these items.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* View Count Badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
                <FaEye className="text-purple-600" />
                {(product.sections?.trending?.viewCount || 0).toLocaleString()}
              </div>
              
              {/* Trending Rank for top 3 */}
              {index < 3 && (
                <div className="absolute -top-3 -left-3 z-10 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-lg">
                  {index + 1}
                </div>
              )}
              
              <Product product={product} />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link 
            to="/shop?filter=trending"
            className="group relative flex items-center gap-3 bg-[#212B36] text-white px-8 py-4 rounded-xl font-mono font-bold uppercase tracking-widest text-sm overflow-hidden transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Explore Trending</span>
            <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;