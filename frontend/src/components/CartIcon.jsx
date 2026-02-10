/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from "framer-motion";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

const CartIcon = ({ cartCount, onClick }) => {
  return (
    <Link to="/cart" onClick={onClick} className="relative group block">
      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-full border border-gray-200 transition-all duration-300 ease-in-out group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:shadow-sm">
        <RiShoppingBag3Fill
          className="text-gray-400 transition-colors duration-300 group-hover:text-blue-600"
          size={20}
        />

        {/* Dynamic Badge */}
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 text-[8px] sm:text-[10px] font-bold text-white bg-blue-600 rounded-full border-2 border-white  hover:border-blue-100"
            >
              {cartCount}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
};

export default CartIcon;
