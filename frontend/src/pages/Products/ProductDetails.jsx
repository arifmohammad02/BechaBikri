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
import Ratings from "./Ratings";
import { FaTruck, FaPlus, FaMinus } from "react-icons/fa";
import {
  HiOutlineInformationCircle,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import AddToCartButton from "../../components/AddToCartButton";
import { motion } from "framer-motion";

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

  // --- 🛠️ Logic Section (Synced with Backend calcPrices) ---
  const discountPercent =
    product?.discountPercentage || product?.disdiscountPercentage || 0;
  const basePrice = product?.price || 0;
  const unitPriceAfterDiscount =
    basePrice - (basePrice * discountPercent) / 100;

  // Backend itemsPrice logic equivalent for single product view
  const itemsPrice = unitPriceAfterDiscount * qty;

  const itemWeight = Number(product?.weight) || 0.5;
  const totalWeight = itemWeight * qty;

  const {
    shippingType,
    insideDhakaCharge,
    outsideDhakaCharge,
    fixedShippingCharge,
    freeShippingThreshold,
    isFreeShippingActive,
  } = product?.shippingDetails || {};

  const calculateEstimatedShipping = (isDhaka) => {
    // 1. Free Shipping Threshold Check (Backend line: if (itemsPrice < freeThreshold))
    if (
      (isFreeShippingActive &&
        itemsPrice >= (freeShippingThreshold || 999999)) ||
      shippingType === "free"
    )
      return 0;
    // 2. Fixed Shipping Check
    if (shippingType === "fixed") return fixedShippingCharge || 0;

    // 3. Weight Based Check (Backend line: if (totalWeight > 0))
    if (shippingType === "weight-based") {
      let baseRate = isDhaka
        ? insideDhakaCharge || 80
        : outsideDhakaCharge || 150;
      let dynamicPrice = baseRate;

      // Extra weight logic (Backend line: const extraWeight = Math.ceil(totalWeight - 1))
      if (totalWeight > 1) {
        const extraWeight = Math.ceil(totalWeight - 1);
        dynamicPrice += extraWeight * 20;
      }
      return dynamicPrice;
    }
    return 0;
  };

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
          <span className="text-gray-200">/</span>
          <Link to="/shop" className="hover:text-black transition-colors">
            {product.category?.name}
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-gray-900 truncate font-semibold">
            {product.name}
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-20">
       
          {/* 🟢 AriX Gear Premium Tech Image Gallery */}
          <div className="lg:w-1/2">
            <div className="sticky top-32 flex flex-col-reverse lg:flex-row gap-8">
              {/* 🟢 Vertical Tech Thumbnails (Left Side) */}
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

              {/* 🟢 Main Tech Display Area */}
              <div className="relative flex-1 bg-gradient-to-br from-[#fcfcfc] to-[#f5f5f5] rounded-[2.5rem] overflow-hidden aspect-square flex items-center justify-center p-12 border border-gray-100/50 group shadow-sm">
                {/* 🔥 Tech Discount Badge (Floating Glassmorphism) */}
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
          <div className="lg:w-1/2 space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="bg-black text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] font-dosis">
                  {product.brand || "AriX Gear"}
                </span>
                {product.countInStock > 0 ? (
                  <span className="text-[11px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-2 font-poppins">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{" "}
                    In Stock
                  </span>
                ) : (
                  <span className="text-[11px] text-red-500 font-bold uppercase tracking-widest font-poppins">
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="font-playfair text-5xl md:text-7xl font-medium text-gray-900 tracking-tight leading-[1.1]">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 pt-2">
                <Ratings value={product.rating} />
                <span className="text-sm text-gray-400 font-medium font-poppins">
                  {product.numReviews} Verified Reviews
                </span>
              </div>
            </header>

            <div className="space-y-10">
              <div className="flex items-baseline gap-5">
                <span className="text-6xl font-figtree font-bold text-gray-900 tracking-tighter">
                  ৳{itemsPrice.toLocaleString()}
                </span>
                {discountPercent > 0 && (
                  <span className="text-3xl text-gray-300 line-through font-light font-figtree">
                    ৳{(basePrice * qty).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Action Box */}
              <div className="p-5 bg-[#FBFBFB] rounded-[2rem] border border-gray-100/80 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] font-dosis">
                    Select Quantity
                  </span>
                  <div className="flex items-center bg-white rounded-2xl border border-gray-200 p-1 shadow-sm">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                    >
                      <FaMinus size={14} />
                    </button>
                    <span className="w-14 text-center text-lg font-bold font-figtree">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty(Math.min(product.countInStock || 10, qty + 1))
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                </div>

                <AddToCartButton
                  product={product}
                  qty={qty}
                  buttonText="Add to Cart"
                  isOrderNow={true}
                  className="py-6 rounded-2xl font-poppins text-lg tracking-wide shadow-lg"
                />
              </div>
            </div>

            {/* Logistics Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-5 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <FaTruck className="text-blue-600 text-xl" />
                </div>
                <div className="space-y-2 w-full">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-dosis">
                      Shipping Info
                    </h4>
                    <div className="flex gap-1">
                      {shippingType === "free" ||
                      (isFreeShippingActive &&
                        itemsPrice >= freeShippingThreshold) ? (
                        <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase font-poppins">
                          Free
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase font-poppins">
                          {shippingType}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-figtree text-gray-900 leading-none">
                      ৳{calculateEstimatedShipping(true)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter font-poppins">
                      Delivery
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-5 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <HiOutlineShieldCheck className="text-green-600 text-2xl" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-dosis">
                    Authenticity
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-figtree text-gray-900 leading-none">
                      Original
                    </span>
                    <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-black font-poppins">
                      100%
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium font-poppins leading-snug">
                    7-day easy return policy
                  </p>
                </div>
              </div>
            </div>

            {/* Free Shipping Progress */}
            {isFreeShippingActive &&
              freeShippingThreshold > 0 &&
              itemsPrice < freeShippingThreshold && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-center gap-5 p-6 bg-black text-white rounded-[2rem] shadow-2xl shadow-gray-300"
                >
                  <div className="p-3 bg-white/10 rounded-xl">
                    <HiOutlineInformationCircle className="text-blue-400 text-2xl" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] font-dosis leading-relaxed">
                    Add{" "}
                    <span className="text-blue-400 text-lg font-figtree ml-1">
                      ৳{(freeShippingThreshold - itemsPrice).toLocaleString()}
                    </span>{" "}
                    more for{" "}
                    <span className="underline underline-offset-8 decoration-blue-500 decoration-2">
                      Free Delivery
                    </span>
                  </p>
                </motion.div>
              )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 pt-24 border-t border-gray-100">
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
