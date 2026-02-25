import { Link } from "react-router-dom";
// import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProduct ";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import { FaLongArrowAltRight } from "react-icons/fa";
import Category from "./Category";
import { motion } from "framer-motion"; // অ্যানিমেশনের জন্য
import TopBarBanner from "./TopBarBanner";
import HeroBanner from "./HeroBanner";

  
const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-red-500 font-mono font-bold uppercase tracking-widest">Error Loading Products</h1>
      </div>
    );
  }

  return (
    <div className="bg-white">


       <TopBarBanner />

      {/* 🆕 Hero Banner Section */}
      <div className="">
        <HeroBanner />
        {/* <CategoryBanners/> */}
      </div>




      {/* 🟢 Category Navigation */}
      <div className="py-8">
        <Category />
      </div>

      {/* 🟢 Top Products Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="w-full">
          {/* Section Header - লোগো স্টাইলে সাজানো */}
          <div className="flex flex-col items-center mb-12 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <span className="text-blue-600 font-mono font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs">
                Premium Selection
              </span>
              <h1 className="text-3xl md:text-5xl font-mono font-black text-[#212B36] mt-2 mb-4 tracking-tighter">
                Our <span className="text-[#B88E2F]">Products</span>
              </h1>
              
              {/* Signature Underline Animation */}
              <div className="flex justify-center">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "80px" }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-[3px] bg-gradient-to-r from-blue-600 to-[#B88E2F] rounded-full"
                />
              </div>
              
              <p className="max-w-xl mx-auto text-gray-500 font-figtree font-normal mt-6 text-sm md:text-base leading-relaxed">
                Explore our top-rated gadgets and gear. Quality meets innovation 
                at AriX GeaR, bringing you the best tech in the market.
              </p>
            </motion.div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10 w-full">
            {data.map((product, index) => (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SmallProduct product={product} />
              </motion.div>
            ))}
          </div>

          {/* 🟢 View All Button - সার্ভিস ট্যাগের মত ডার্ক প্রিমিয়াম লুক */}
          <div className="flex justify-center mt-12">
            <Link to="/shop">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-3 bg-[#212B36] text-white px-8 py-3.5 rounded-xl font-mono font-bold uppercase tracking-widest text-xs overflow-hidden transition-all shadow-xl hover:shadow-blue-500/20"
              >
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">View All Gear</span>
                <FaLongArrowAltRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;