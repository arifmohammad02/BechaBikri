import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "@redux/api/productApiSlice";
import { motion } from "framer-motion"; // অ্যানিমেশনের জন্য
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import { FaLongArrowAltRight } from "react-icons/fa";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="bg-white min-h-screen">
      {!keyword ? <Header /> : null}

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        ) : (
          <>
            {/* 🟢 Section Header - লোগোর স্টাইলে সাজানো */}
            <div className="flex flex-col items-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <span className="text-blue-600 font-mono font-bold tracking-[0.4em] uppercase text-xs">
                  Exclusive Collection
                </span>
                <h1 className="text-3xl md:text-5xl font-mono font-black text-[#212B36] mt-2 mb-4 tracking-tighter">
                  Special <span className="text-[#B88E2F]">Products</span>
                </h1>
                
                {/* লোগোর সেই সিগনেচার আন্ডারলাইন */}
                <div className="flex justify-center">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "80px" }}
                    transition={{ duration: 1 }}
                    className="h-[3px] bg-gradient-to-r from-blue-600 to-[#B88E2F] rounded-full"
                  />
                </div>
                
                <p className="max-w-xl mx-auto text-gray-500 font-figtree font-normal mt-6 leading-relaxed">
                  Discover the next generation of tech gadgets at AriX GeaR. 
                  Where premium quality meets cutting-edge innovation.
                </p>
              </motion.div>
            </div>

            {/* 🟢 Product Grid - স্মুথ অ্যাপেয়ারেন্স */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
            >
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
            </motion.div>

            {/* 🟢 View All Button - সার্ভিস ট্যাগের ড্যাশড স্টাইল */}
            <div className="flex justify-center mt-20">
              <Link to="/shop">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex items-center gap-3 bg-[#212B36] text-white px-8 py-4 rounded-xl font-mono font-bold uppercase tracking-widest text-sm overflow-hidden transition-all"
                >
                  {/* হোভার করলে নীল রঙের একটা গ্লো আসবে */}
                  <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <span className="relative z-10">View All Gadgets</span>
                  <FaLongArrowAltRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                </motion.button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;