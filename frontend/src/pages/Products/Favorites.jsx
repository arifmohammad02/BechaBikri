import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorite/favoriteSlice";
import Product from "./Product";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { LuHeart } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#FDFDFD] min-h-screen pb-20">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[105px]">
          {/* Header */}
          <div className="py-10 bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4">
              <h1 className="text-2xl font-bold border-l-4 border-red-600 pl-4 text-gray-800 uppercase tracking-widest font-mono">
                Wishlist <span className="text-red-600">Vault</span>
              </h1>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em] ml-5">
                <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gray-900 font-black tracking-widest">Favorites</span>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-12">
            {favorites.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-gray-50 shadow-sm"
              >
                <div className="relative mb-6">
                  <LuHeart className="w-20 h-20 text-gray-100" />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-red-500/5 blur-xl rounded-full"
                  />
                </div>
                <h2 className="text-2xl font-mono font-black text-gray-800 uppercase tracking-tighter mb-3">
                  Your Vault is Empty
                </h2>
                <p className="max-w-xs text-center text-gray-400 text-sm font-mono mb-10 leading-relaxed">
                  No tactical gear saved yet. Explore the shop to add items to your wishlist.
                </p>
                <Link to="/shop">
                  <button className="flex items-center gap-3 bg-black text-white py-4 px-10 rounded-2xl font-mono font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all duration-500 shadow-lg active:scale-95">
                    Go To Shop <FaArrowRight />
                  </button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                   <span className="font-mono text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                     {favorites.length} Items Saved
                   </span>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  <AnimatePresence>
                    {favorites.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="hover:translate-y-[-5px] transition-transform duration-300"
                      >
                        {/* ✅ Product কম্পোনেন্ট আপডেট করা হয়েছে */}
                        <Product product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                <div className="pt-10 border-t border-gray-100">
                  <Link to="/shop" className="inline-flex items-center gap-3 text-gray-400 hover:text-black font-mono text-[11px] font-black uppercase tracking-widest transition-all group">
                    <FaArrowRightLong className="rotate-180 group-hover:-translate-x-2 transition-transform" />
                    Continue Gear Hunting
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;