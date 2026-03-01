import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaTruck, FaShieldAlt, FaHeadset } from "react-icons/fa";

const Header = () => {
  return (
    <header className="relative min-h-[90vh] overflow-hidden" style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
      {/* Dark Tech Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute left-2/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute left-3/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[60vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 rounded-full px-5 py-2 backdrop-blur-sm"
            >
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-sm font-bold uppercase tracking-wider">
                New Collection 2024
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Premium Tech <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-amber-400">
                Gear & Gadgets
              </span>
            </h1>

            <p className="text-gray-400 text-xl max-w-lg leading-relaxed">
              Discover cutting-edge technology and premium accessories at AriX GeaR. 
              Elevate your digital lifestyle with our curated collection.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25"
                >
                  Shop Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/shop?sort=newest">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 border border-white/20 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
                >
                  New Arrivals
                </motion.button>
              </Link>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
              {[
                { icon: FaTruck, text: "Free Shipping", color: "text-blue-400", bg: "bg-blue-500/10" },
                { icon: FaShieldAlt, text: "2 Year Warranty", color: "text-amber-400", bg: "bg-amber-500/10" },
                { icon: FaHeadset, text: "24/7 Support", color: "text-green-400", bg: "bg-green-500/10" }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center`}>
                    <feature.icon className={feature.color} />
                  </div>
                  <span className="text-sm font-bold">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Abstract Tech Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden md:block relative"
          >
            <div className="relative w-full h-[500px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border border-white/5 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500/20 to-amber-500/20 rounded-full blur-3xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </header>
  );
};

export default Header;