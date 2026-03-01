import { motion } from "framer-motion";
import { useGetFooterBannersQuery } from "@redux/api/bannerApiSlice";
import { 
  FaShippingFast, 
  FaUndo, 
  FaShieldAlt, 
  FaHeadset,
  FaCreditCard,
  FaAward,
  FaCheckCircle
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

  // Default features if no banner data
  const defaultFeatures = [
    { icon: "truck", title: "Free Shipping", description: "On orders over ৳2000" },
    { icon: "shield-check", title: "Secure Payment", description: "100% protected checkout" },
    { icon: "refresh-cw", title: "Easy Returns", description: "30-day return policy" },
    { icon: "headphones", title: "24/7 Support", description: "Dedicated help center" },
  ];

  const features = banners?.[0]?.metaData?.features || defaultFeatures;
  const accentColor = banners?.[0]?.buttonColor || "#2563eb";

  return (
    <section className="py-16 relative overflow-hidden" style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || FaShieldAlt;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
              >
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-blue-50 group-hover:to-blue-100 transition-colors"
                  style={{ color: accentColor }}
                >
                  <IconComponent size={28} />
                </motion.div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
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
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8"
        >
          {[
            { icon: FaShieldAlt, text: "SSL Secure Payment" },
            { icon: FaCheckCircle, text: "Verified Products" },
            { icon: FaAward, text: "Quality Guaranteed" }
          ].map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
              <badge.icon className="text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FooterBanners;