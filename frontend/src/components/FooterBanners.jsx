import { motion } from "framer-motion";
import { useGetFooterBannersQuery } from "@redux/api/bannerApiSlice";
import { 
  FaShippingFast, 
  FaUndo, 
  FaShieldAlt, 
  FaHeadset,
  FaCreditCard,
  FaAward
} from "react-icons/fa";

const iconMap = {
  truck: FaShippingFast,
  "refresh-cw": FaUndo,
  "shield-check": FaShieldAlt,
  headphones: FaHeadset,
  "credit-card": FaCreditCard,
  award: FaAward,
};

const FooterBanners = () => {
  const { data: banners } = useGetFooterBannersQuery();

  if (!banners?.length) return null;

  const banner = banners[0]; // Usually only one footer banner
  const features = banner.metaData?.features || [];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        {banner.headline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-black text-gray-800">
              {banner.headline}
            </h2>
          </motion.div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || FaShieldAlt;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: banner.buttonColor + "20" }}
                >
                  <IconComponent 
                    size={24} 
                    style={{ color: banner.buttonColor }} 
                  />
                </div>
                <h3 className="font-black text-sm text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap justify-center items-center gap-6 opacity-60"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <FaShieldAlt /> SSL Secure Payment
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <FaCreditCard /> 100% Payment Protection
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <FaAward /> Genuine Products
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FooterBanners;