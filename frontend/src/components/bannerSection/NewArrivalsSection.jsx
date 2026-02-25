// components/home/NewArrivalsSection.jsx
import { useGetNewArrivalsQuery } from "../../redux/api/productApiSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaSprayCanSparkles, FaArrowRight } from "react-icons/fa6";
import Product from "../../pages/Products/Product";

const NewArrivalsSection = () => {
  const { data: products, isLoading } = useGetNewArrivalsQuery();

  if (isLoading || !products?.length) return null;

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-16"
        >
          <div className="text-center md:text-left">
            <span className="text-blue-600 font-mono font-bold tracking-[0.4em] uppercase text-xs flex items-center justify-center md:justify-start gap-2">
              <FaSprayCanSparkles /> Just Landed
            </span>
            <h2 className="text-3xl md:text-5xl font-mono font-black text-[#212B36] mt-2 tracking-tighter">
              New <span className="text-blue-600">Arrivals</span>
            </h2>
            <div className="flex justify-center md:justify-start mt-4">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 1 }}
                className="h-[3px] bg-gradient-to-r from-blue-600 to-[#B88E2F] rounded-full"
              />
            </div>
          </div>
          
          <Link 
            to="/shop?sort=newest"
            className="mt-6 md:mt-0 group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors"
          >
            View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[280px] md:min-w-[300px] snap-start"
              >
                <div className="relative">
                  {/* NEW Badge */}
                  <div className="absolute -top-3 -left-3 z-10 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
                    NEW
                  </div>
                  <Product product={product} />
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-8 w-32 bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;