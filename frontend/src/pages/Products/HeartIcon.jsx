/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // স্পিনারের জন্য
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorite/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
  const [isSyncing, setIsSyncing] = useState(false); // স্পিনার স্টেট
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);

  const toggleFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation(); // কার্ডের ক্লিক ইভেন্ট আটকানোর জন্য

    setIsSyncing(true); // স্পিনার শুরু

    // সামান্য ডিলে দেওয়া হয়েছে যাতে ইউজার স্মুথ অ্যানিমেশনটি দেখতে পায়
    setTimeout(() => {
      if (isFavorite) {
        dispatch(removeFromFavorites(product));
        removeFavoriteFromLocalStorage(product._id);
      } else {
        dispatch(addToFavorites(product));
        addFavoriteToLocalStorage(product);
      }
      setIsSyncing(false); // স্পিনার শেষ
    }, 600); 
  };

  return (
    <motion.div
      onClick={toggleFavorites}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {isSyncing ? (
          // 🟢 ১. স্মুথ স্পিনার অ্যানিমেশন
          <motion.div
            key="loader"
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            className="text-blue-600"
          >
            <AiOutlineLoading3Quarters size={18} />
          </motion.div>
        ) : (
          // 🟢 ২. হার্ট আইকন অ্যানিমেশন
          <motion.div
            key="icon"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-[18px]" />
            ) : (
              <FaRegHeart className="text-gray-400 hover:text-blue-600 text-[18px]" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 ৩. লোগোর মতো গোল্ডেন গ্লো ইফেক্ট (Hover-এ আসবে) */}
      <motion.div
        className="absolute inset-0 bg-[#B88E2F]/5 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </motion.div>
  );
};

export default HeartIcon;