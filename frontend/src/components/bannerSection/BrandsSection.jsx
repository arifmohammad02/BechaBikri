// components/home/BrandsSection.jsx
import { useGetBrandsQuery } from "../../redux/api/productApiSlice";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";

const BrandsSection = () => {
  const { data: brands, isLoading } = useGetBrandsQuery();

  if (isLoading || !brands?.length) return null;

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-mono font-bold tracking-[0.4em] uppercase text-xs">
            Trusted Partners
          </span>
          <h2 className="text-3xl md:text-5xl font-mono font-black text-[#212B36] mt-2 tracking-tighter">
            Top <span className="text-[#B88E2F]">Brands</span>
          </h2>
          <div className="flex justify-center mt-4">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "80px" }}
              transition={{ duration: 1 }}
              className="h-[3px] bg-gradient-to-r from-blue-600 to-[#B88E2F] rounded-full mx-auto"
            />
          </div>
          <p className="max-w-md mx-auto text-gray-500 font-figtree mt-6">
            Premium quality from world-class manufacturers
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link 
                to={`/shop?brand=${encodeURIComponent(brand._id)}`}
                className="group block bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 h-full"
              >
                <div className="aspect-[3/2] rounded-xl bg-gray-50 mb-4 overflow-hidden flex items-center justify-center p-4 group-hover:bg-blue-50 transition-colors">
                  {brand.logo ? (
                    <img 
                      src={brand.logo} 
                      alt={brand._id}
                      className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="text-2xl font-black text-gray-300 group-hover:text-blue-600 font-mono transition-colors">
                      {brand._id?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-mono font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                    {brand._id}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-figtree">
                    {brand.productCount} Products
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link 
            to="/brands"
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors"
          >
            View All Brands 
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;