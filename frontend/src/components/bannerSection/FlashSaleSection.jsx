// components/home/FlashSaleSection.jsx
import { useEffect, useState } from "react";
import { useGetFlashSaleProductsQuery } from "../../redux/api/productApiSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBolt, FaClock } from "react-icons/fa6";
import Product from "../../pages/Products/Product"; // আপনার আগের Product কম্পোনেন্ট

const FlashSaleSection = () => {
  const { data, isLoading } = useGetFlashSaleProductsQuery();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (data?.flashSaleEndTime) {
      const timer = setInterval(() => {
        const end = new Date(data.flashSaleEndTime).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (diff > 0) {
          setTimeLeft({
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data]);

  if (isLoading || !data?.products?.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header - AriX Style */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center md:text-left mb-8 md:mb-0"
          >
            <span className="text-red-600 font-mono font-bold tracking-[0.4em] uppercase text-xs flex items-center justify-center md:justify-start gap-2">
              <FaBolt className="animate-pulse" /> Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-5xl font-mono font-black text-[#212B36] mt-2 tracking-tighter">
              Flash <span className="text-red-600">Sale</span>
            </h2>
            <div className="flex justify-center md:justify-start mt-4">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 1 }}
                className="h-[3px] bg-gradient-to-r from-red-600 to-[#B88E2F] rounded-full"
              />
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-gray-50 px-8 py-4 rounded-2xl border border-gray-100"
          >
            <FaClock className="text-red-600 text-xl" />
            <div className="flex gap-2 font-mono font-bold text-2xl">
              {Object.entries(timeLeft).map(([unit, value], i) => (
                <div key={unit} className="flex items-center">
                  <span className={`px-3 py-2 rounded-xl text-white ${i === 2 ? 'bg-[#212B36]' : 'bg-red-600'}`}>
                    {String(value).padStart(2, '0')}
                  </span>
                  {i < 2 && <span className="text-gray-400 mx-1">:</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {data.products.map((product, index) => (
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

        <div className="flex justify-center mt-16">
          <Link 
            to="/flash-sale"
            className="group relative flex items-center gap-3 bg-[#212B36] text-white px-8 py-4 rounded-xl font-mono font-bold uppercase tracking-widest text-sm overflow-hidden transition-all hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">View All Deals</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;