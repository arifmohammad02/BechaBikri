/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useGetBestSellersQuery } from "../../redux/api/productApiSlice";
import Product from "../../pages/Products/Product";
import Message from "../Message";
import {
  FaLongArrowAltRight,
  FaFire,
  FaClock,
  FaTrophy,
  FaTshirt,
  FaStar,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 🎯 Product Skeleton Component
const ProductSkeleton = ({ rank }) => {
  return (
    <div
      className="relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col"
      aria-hidden="true"
    >
      {/* Rank Badge Skeleton */}
      {rank <= 2 && (
        <div
          className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md z-10 ${
            rank === 0
              ? "bg-yellow-200"
              : rank === 1
                ? "bg-gray-200"
                : "bg-orange-200"
          }`}
        >
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
        </div>
      )}

      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FaTshirt className="text-gray-300 text-4xl" />
        </div>

        {/* Discount Badge Skeleton */}
        <div className="absolute top-2 right-2 w-12 h-5 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="p-3 flex flex-col flex-grow space-y-2">
        {/* Brand */}
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />

        {/* Title */}
        <div className="w-full h-4 bg-gray-300 rounded animate-pulse" />
        <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse" />

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaStar key={i} className="text-gray-200 text-xs" />
          ))}
          <div className="w-8 h-3 bg-gray-200 rounded ml-1 animate-pulse" />
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="w-20 h-5 bg-gray-300 rounded animate-pulse" />
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Sales Count */}
        <div className="w-24 h-3 bg-orange-100 rounded mt-1 animate-pulse" />
      </div>
    </div>
  );
};

// 🎯 Section Header Skeleton
const HeaderSkeleton = () => (
  <div className="flex flex-col items-center mb-10">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-4 h-4 bg-orange-200 rounded-full animate-pulse" />
      <div className="w-24 h-4 bg-orange-200 rounded animate-pulse" />
      <div className="w-4 h-4 bg-orange-200 rounded-full animate-pulse" />
    </div>

    <div className="w-48 h-8 bg-gray-300 rounded-lg mb-4 animate-pulse" />

    <div className="flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-full border border-gray-200">
      <FaClock className="text-gray-300" />
      <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
    </div>

    <div className="w-20 h-1 bg-orange-200 rounded-full animate-pulse" />
  </div>
);

// 🎯 View All Button Skeleton
const ButtonSkeleton = () => (
  <div className="flex justify-center mt-10">
    <div className="w-48 h-12 bg-orange-200 rounded-lg animate-pulse" />
  </div>
);

const BestSellers = () => {
  const { data: products, isLoading, isError } = useGetBestSellersQuery(10);
  const [bdTime, setBdTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
      );
      setBdTime(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const rankBadge = (index) => {
    const badges = [
      {
        bg: "bg-yellow-400",
        text: "text-yellow-900",
        icon: FaTrophy,
        label: "Rank 1 Best Seller",
      },
      {
        bg: "bg-gray-300",
        text: "text-gray-800",
        num: "2",
        label: "Rank 2 Best Seller",
      },
      {
        bg: "bg-orange-400",
        text: "text-white",
        num: "3",
        label: "Rank 3 Best Seller",
      },
    ];

    if (index > 2) return null;
    const badge = badges[index];

    return (
      <div
        className={`absolute -top-2 -left-2 w-8 h-8 ${badge.bg} ${badge.text} rounded-full flex items-center justify-center text-xs font-bold shadow-md z-10`}
        title={badge.label}
        aria-label={badge.label}
      >
        {badge.icon ? <badge.icon size={14} aria-hidden="true" /> : badge.num}
      </div>
    );
  };

  // 🎯 Skeleton Loading State
  if (isLoading) {
    return (
      <section
        className="py-12 bg-gray-50"
        style={{ fontFamily: '"Trebuchet MS", sans-serif' }}
      >
        <div className="container mx-auto px-4">
          <HeaderSkeleton />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-stretch">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex flex-col"
              >
                <ProductSkeleton rank={index} />
              </motion.div>
            ))}
          </div>

          <ButtonSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 bg-gray-50"
      style={{ fontFamily: '"Trebuchet MS", sans-serif' }}
      aria-labelledby="bestsellers-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-3">
            <FaFire className="text-orange-500 text-lg" aria-hidden="true" />
            <span className="text-orange-600 font-bold text-sm uppercase tracking-wider">
              Best Sellers
            </span>
            <FaFire className="text-orange-500 text-lg" aria-hidden="true" />
          </div>

          <h2
            id="bestsellers-heading"
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Trending Now
          </h2>

          {/* BD Time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-white px-4 py-2 rounded-full border border-gray-200">
            <FaClock className="text-gray-400" aria-hidden="true" />
            <span>{bdTime} (BD Time)</span>
          </div>

          <div
            className="w-20 h-1 bg-orange-500 rounded-full"
            aria-hidden="true"
          />
        </div>

        {/* 5 Column Grid - Fixed Height */}
        {isError ? (
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-stretch">
              {products?.slice(0, 10).map((product, index) => (
                <motion.div
                  key={product._id}
                  className="relative flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {rankBadge(index)}
                  <div className="flex-grow">
                    <Product product={product} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link to="/shop?sort=bestselling">
                <button
                  className="flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 "
                  aria-label="View all best selling products"
                >
                  View All Best Sellers{" "}
                  <FaLongArrowAltRight ria-hidden="true" />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
