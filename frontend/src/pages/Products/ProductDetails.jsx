import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "@redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import ProductTabs from "./ProductTabs";
import { FaTruck, FaPlus, FaMinus } from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import AddToCartButton from "../../components/AddToCartButton";

import { motion } from "framer-motion";
import React from "react";

// UPDATE START
import { 
  calculateProductPrice, 
  calculateProductShipping, 
  getCategoryPath 
} from "../../components/ProductLogistics";
// UPDATE END

const ProductDetails = () => {
  const { id: productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  console.log(product);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  useEffect(() => {
    if (product) {
      const allImages =
        product.images?.length > 0
          ? product.images
          : product.image
            ? [product.image]
            : [];
      if (allImages.length > 0) setActiveImage(allImages[0]);
    }
  }, [product]);

  // UPDATE START
  const { itemsPrice, basePrice, discountPercent } = calculateProductPrice(product, qty);
  const estimatedShipping = calculateProductShipping(product, qty, true);
  const categoryPath = product ? getCategoryPath(product.category) : [];
  
  const sDetails = product?.shippingDetails || {};
  const isFreeEligible = sDetails.isFreeShippingActive && (itemsPrice >= (sDetails.freeShippingThreshold || 0));
  const isAlwaysFree = sDetails.shippingType === "free";
  // UPDATE END

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review submitted");
      setComment("");
      setRating(0);
    } catch (error) {
      toast.error(error?.data?.message || "Error");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message}</Message>;

  return (
    <div className="bg-white min-h-screen font-figtree selection:bg-black selection:text-white">
      {/* 🟢 Breadcrumb */}
      <nav className="mt-[105px] py-6 border-b border-gray-50">
        <div className="container mx-auto px-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gray-400 font-bold font-dosis">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>

          {/* UPDATE START */}
          {categoryPath.map((cat, index) => (
            <React.Fragment key={cat._id || index}>
              <span className="text-gray-200">/</span>
              <Link
                to={`/shop?category=${cat._id}`}
                className="hover:text-black transition-colors"
              >
                {cat.name}
              </Link>
            </React.Fragment>
          ))}
          {/* UPDATE END */}

          <span className="text-gray-200">/</span>
          <span className="text-gray-900 truncate font-semibold">
            {product.name}
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Image Gallery */}
          <div className="lg:w-[45%]">
            <div className="sticky top-32 flex flex-col-reverse lg:flex-row gap-8">
              {/* Thumbnails (Left Side) */}
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar py-2 lg:max-h-[500px] flex-shrink-0">
                {(product.images?.length > 0
                  ? product.images
                  : [product.image]
                ).map((img, index) => (
                  <div
                    key={index}
                    className="relative group/thumb flex-shrink-0"
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-xl cursor-pointer border-2 transition-all duration-500 ease-in-out ${
                        activeImage === img
                          ? "border-black shadow-[0_10px_20px_rgba(0,0,0,0.1)] scale-105"
                          : "border-gray-100 opacity-40 grayscale group-hover/thumb:grayscale-0 group-hover/thumb:opacity-100"
                      }`}
                    />
                    {activeImage === img && (
                      <motion.div
                        layoutId="techIndicator"
                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-black rounded-r-full hidden lg:block"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/*Display Area */}
              <div className="relative flex-1 bg-gradient-to-br from-[#fcfcfc] to-[#f5f5f5] rounded-[2.5rem] overflow-hidden aspect-square flex items-center justify-center p-12 border border-gray-100/50 group shadow-sm">
                {discountPercent > 0 && (
                  <div className="absolute top-8 left-8 z-10">
                    <div className="backdrop-blur-md bg-white/60 border border-white/40 px-5 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col items-center">
                      <span className="text-[9px] font-black font-dosis uppercase tracking-[0.2em] text-gray-400 leading-none mb-1">
                        Tech Offer
                      </span>
                      <span className="text-2xl font-black font-figtree text-black">
                        -
                        {Math.round(
                          ((basePrice - itemsPrice / qty) / basePrice) * 100,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                )}

                {/* Main Product Image with subtle Shadow */}
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  src={activeImage}
                  className="max-h-full object-contain mix-blend-multiply transition-transform duration-1000 ease-out group-hover:scale-[1.08]"
                />

                {/* Bottom Tech Label */}
                <div className="absolute bottom-8 flex flex-col items-center gap-1">
                  <div className="w-12 h-[2px] bg-black/10 rounded-full mb-2 overflow-hidden">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}
                      className="w-full h-full bg-black/40"
                    />
                  </div>
                  <span className="text-[10px] font-bold font-dosis uppercase tracking-[0.4em] text-gray-400">
                    Arix Gear
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🟢 Product Info */}
          <div className="lg:w-[55%] space-y-2">
            {/* ================= HEADER ================= */}
            <header className="space-y-8">
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left Side: Brand, Name & Status */}
                  <div className="w-full">
                    {/* Product Title */}
                    <h1 className="text-[18px] md:text-[22px] font-trebuchet text-[#3749BB] mb-3">
                      {product.name}
                    </h1>

                    {/* Info Badges Row */}
                    <div className="flex items-center flex-wrap gap-1">
                      {/* Price Badge */}
                      <div className="flex items-center gap-1 bg-[#F5F6FC] px-2 py-2 rounded-xl">
                        <span className="text-[14px] text-[#666666] font-normal font-trebuchet">
                          Price:
                        </span>
                        <span className="text-[14px] font-bold font-trebuchet text-gray-900">
                          ৳{itemsPrice.toFixed()}
                        </span>
                      </div>

                      {/* Regular Price (Discount) Badge */}
                      {discountPercent > 0 && (
                        <div className="flex items-center gap-1 bg-[#F5F6FC] px-2 py-2 rounded-xl">
                          <span className="text-[14px] text-[#666666] font-normal font-trebuchet">
                            Regular Price:
                          </span>
                          <span className="text-[14px] font-bold font-trebuchet text-gray-900">
                            ৳{(basePrice * qty).toFixed()}
                          </span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="flex items-center gap-1 bg-[#F5F6FC] px-2 py-2 rounded-xl">
                        <span className="text-[14px] text-[#666666] font-normal font-trebuchet">
                          Status:
                        </span>
                        <span
                          className={`text-[14px] font-bold font-trebuchet text-gray-900 ${product.countInStock > 0 ? "text-emerald-600" : "text-rose-500"}`}
                        >
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>

                      {/* Product Code Badge */}
                      <div className="flex items-center gap-1 bg-[#F5F6FC] px-2 py-2 rounded-xl">
                        <span className="text-[14px] text-[#666666] font-normal font-trebuchet">
                          Product Code:
                        </span>
                        <span className="text-[14px] font-bold font-trebuchet text-gray-900">
                          {product._id?.slice(-5) || "47586"}
                        </span>
                      </div>

                      {/* Brand Badge */}
                      <div className="flex items-center gap-1 bg-[#F5F6FC] px-2 py-2 rounded-xl">
                        <span className="text-[14px] text-[#666666] font-normal font-trebuchet">
                          Brand:
                        </span>
                        <span className="text-[14px] font-bold font-trebuchet text-gray-900">
                          {product.brand || "Sony"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h4 className="text-[18px] font-normal text-gray-900 mb-2 font-trebuchet">
                    Key Features
                  </h4>
                  <div className="space-y-1">
                    {product.specifications.map((spec) => (
                      <div
                        key={spec._id}
                        className="flex items-center border-b border-gray-100 pb-2 gap-1 group"
                      >
                        <span className="text-[12px] font-normal font-trebuchet text-gray-900 uppercase">
                          {spec.label}
                        </span>
                        <span className="text-sm font-normal font-trebuchet text-gray-900">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        const element = document.getElementById(
                          "product-tabs-section",
                        );
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-[#3749BB] text-[14px] font-bold hover:underline underline-offset-4 flex items-center gap-1 transition-all"
                    >
                      View More Info
                    </button>
                  </div>
                </div>
              )}
            </header>

            {/* ================= ACTION ================= */}
            <div className="flex gap-3">
              <div className="flex items-center py-0 bg-gray-50 rounded-md border border-gray-200 px-3 transition-all duration-300 hover:bg-white">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl font-figtree font-normal text-[20px] text-[#270000] transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95"
                >
                  <FaMinus size={14} />
                </button>

                <span className="w-8 text-center text-[20px] font-normal font-figtree text-[#270000]">
                  {qty}
                </span>

                <button
                  onClick={() =>
                    setQty(Math.min(product.countInStock || 10, qty + 1))
                  }
                  className="w-8 h-8 flex items-center justify-center font-figtree font-normal text-[20px] rounded-xl text-[#270000] transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95"
                >
                  <FaPlus size={14} />
                </button>
              </div>
              <div className="flex-2">
                <AddToCartButton
                  product={product}
                  qty={qty}
                  buttonText="Add to Cart"
                  isOrderNow={true}
                  className="w-full py-5 rounded-2xl font-poppins text-lg tracking-wide shadow-md transition-all duration-300 hover:shadow-xl active:scale-[0.99]"
                />
              </div>
            </div>

            {/* ================= LOGISTICS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-5 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <FaTruck className="text-blue-600 text-xl" />
                </div>
                <div className="space-y-2 w-full">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-dosis">
                    Shipping Info
                  </h4>
                  {/* UPDATE START */}
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold font-figtree text-gray-900">
                      {isFreeEligible || isAlwaysFree ? "Free" : `৳${estimatedShipping}`}
                    </span>
                    {!isFreeEligible && !isAlwaysFree && sDetails.isFreeShippingActive && (
                       <p className="text-[9px] text-gray-400 font-medium font-poppins mt-1 italic">
                        Free delivery at ৳{sDetails.freeShippingThreshold}
                      </p>
                    )}
                  </div>
                  {/* UPDATE END */}
                </div>
              </div>

              <div className="flex gap-5 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <HiOutlineShieldCheck className="text-green-600 text-2xl" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-dosis">
                    Authenticity
                  </h4>
                  <span className="text-2xl font-bold font-figtree text-gray-900">
                    Original
                  </span>
                  <p className="text-[10px] text-gray-500 font-medium font-poppins">
                    7-day easy return policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div
          id="product-tabs-section"
          className="mt-32 pt-24 border-t border-gray-100"
        >
          <ProductTabs
            {...{
              loadingProductReview,
              userInfo,
              submitHandler,
              rating,
              setRating,
              comment,
              setComment,
              product,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;