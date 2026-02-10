
import { NavLink } from "react-router-dom";
import { BsBagCheck, BsPersonCircle } from "react-icons/bs";
import { motion } from "framer-motion";

const Sidebar = () => {
  return (
    <motion.aside 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden lg:block w-80 h-fit bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm"
    >
      {/* Sidebar Header */}
      <div className="mb-10 px-4">
        <h2 className="font-mono font-black text-[10px] uppercase tracking-[0.4em] text-gray-300">
          User <span className="text-blue-600/50">Portal</span>
        </h2>
      </div>

      <nav className="space-y-3">
        {/* Profile Link */}
        <NavLink to="/profile">
          {({ isActive }) => (
            <motion.div
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group ${
                isActive 
                  ? "bg-gray-900 text-white shadow-2xl shadow-gray-300" 
                  : "text-gray-500 hover:bg-blue-50/50 hover:text-blue-600"
              }`}
            >
              <BsPersonCircle className={`text-lg transition-transform duration-500 ${isActive ? "text-blue-400 scale-110" : "group-hover:text-blue-600"}`} />
              <span className="font-mono text-[11px] font-black uppercase tracking-widest">
                My Profile
              </span>
            </motion.div>
          )}
        </NavLink>

        {/* Orders List Link */}
        <NavLink to="/user-orders">
          {({ isActive }) => (
            <motion.div
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-4 py-4 px-6 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group ${
                isActive 
                  ? "bg-gray-900 text-white shadow-2xl shadow-gray-300" 
                  : "text-gray-500 hover:bg-blue-50/50 hover:text-blue-600"
              }`}
            >
              <BsBagCheck className={`text-lg transition-transform duration-500 ${isActive ? "text-blue-400 scale-110" : "group-hover:text-blue-600"}`} />
              <span className="font-mono text-[11px] font-black uppercase tracking-widest">
                Order History
              </span>
            </motion.div>
          )}
        </NavLink>

        {/* Dynamic Help Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-[2rem] border border-gray-100 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <p className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-widest">
              Support
            </p>
            <p className="text-[11px] text-gray-500 font-mono mt-2 leading-relaxed">
              Facing issues? Our tech team is online.
            </p>
          </div>
          {/* Background Decorative Circle */}
          <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-blue-100/50 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out" />
        </motion.div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;