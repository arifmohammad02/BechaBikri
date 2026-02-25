// components/home/BestSellersSection.jsx
import { useGetBestSellersQuery } from "../../redux/api/productApiSlice";
import { motion } from "framer-motion";
import { FaTrophy, FaFire } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Product from "../../pages/Products/Product";

const BestSellersSection = () => {
  const { data: products, isLoading } = useGetBestSellersQuery();

  if (isLoading || !products?.length) return null;

  const topThree = products.slice(0, 3);
  const others = products.slice(3, 7);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center justify-center gap-2 text-amber-600 font-mono font-bold tracking-[0.4em] uppercase text-xs mb-4">
            <FaFire className="animate-pulse" /> Top Rated
          </span>
          <h2 className="text-3xl md:text-5xl font-mono font-black text-[#212B36] tracking-tighter">
            Best <span className="text-[#B88E2F]">Sellers</span>
          </h2>
          <div className="flex justify-center mt-4">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "80px" }}
              transition={{ duration: 1 }}
              className="h-[3px] bg-gradient-to-r from-amber-600 to-[#B88E2F] rounded-full"
            />
          </div>
          <p className="max-w-md mx-auto text-gray-500 font-figtree mt-6">
            Most loved by our customers. These are flying off the shelves!
          </p>
        </motion.div>

        {/* Top 3 Featured - Larger Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {topThree.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Rank Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-sm shadow-lg ${
                  index === 0 ? "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900" :
                  index === 1 ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800" :
                  "bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900"
                }`}>
                  <FaTrophy />
                  #{index + 1} Best Seller
                </div>
              </div>
              
              {/* Scale up the card slightly for top 3 */}
              <div className="transform hover:scale-[1.02] transition-transform duration-300">
                <Product product={product} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Others Grid */}
        {others.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {others.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Product product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-16">
          <Link 
            to="/shop?sort=best-selling"
            className="group relative flex items-center gap-3 bg-[#212B36] text-white px-8 py-4 rounded-xl font-mono font-bold uppercase tracking-widest text-sm overflow-hidden transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-[#B88E2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">View All Best Sellers</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;