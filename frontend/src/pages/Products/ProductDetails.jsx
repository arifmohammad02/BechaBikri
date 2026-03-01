/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useGetRelatedProductsQuery, // 🆕 Import this
} from "@redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import ProductTabs from "./ProductTabs";
import ProductCard from "./ProductCard"; // 🆕 Import ProductCard
import {
  FaTruck,
  FaPlus,
  FaMinus,
  FaCheck,
  FaBolt,
  FaClock,
  FaHome,
  FaChevronRight,
  FaFolder,
  FaFolderOpen,
} from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import AddToCartButton from "../../components/AddToCartButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  isFlashSaleActive,
  getFlashSaleTimeRemaining,

} from "../../components/ProductLogistics";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [qty, setQty] = useState(1);

  // Variant States
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  // 🆕 Fetch Related Products
  const {
    data: relatedProducts,
    isLoading: relatedLoading,
    error: relatedError,
  } = useGetRelatedProductsQuery(
    {
      productId: product?._id, // Use actual _id, not slug
      limit: 5,
    },
    { skip: !product?._id }, // Skip until _id is available
  );

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  // Flash sale check
  const hasFlashSale = product ? isFlashSaleActive(product) : false;
  const flashSaleInfo = hasFlashSale
    ? getFlashSaleTimeRemaining(product)
    : null;

  useEffect(() => {
    if (product) {
      if (product.defaultColorIndex !== undefined) {
        setSelectedColorIndex(product.defaultColorIndex);
      }
      if (product.defaultSizeIndex !== undefined) {
        setSelectedSizeIndex(product.defaultSizeIndex);
      }

      if (!activeImage) {
        if (product.images?.length > 0) {
          setActiveImage(product.images[0]);
        } else if (product.image) {
          setActiveImage(product.image);
        }
      }
    }
  }, [product]);

  // ... rest of your existing functions (getDisplayImages, getCurrentPrice, etc.)

  const getDisplayImages = () => {
    if (!product) return [];

    const isVariantSelected = product.variants?.some(
      (v, idx) =>
        idx === selectedColorIndex &&
        (v.color.images?.includes(activeImage) ||
          v.color.image === activeImage),
    );

    if (isVariantSelected && product.variants[selectedColorIndex]) {
      const variant = product.variants[selectedColorIndex];
      if (variant.color.images && variant.color.images.length > 0) {
        return variant.color.images;
      }
      if (variant.color.image) {
        return [variant.color.image];
      }
    }

    return product.images?.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
  };

  const getCurrentPrice = () => {
    if (!product) return 0;

    let basePrice = product.price || 0;

    if (
      product.hasVariants &&
      product.variants &&
      product.variants[selectedColorIndex]
    ) {
      const variant = product.variants[selectedColorIndex];
      if (variant.sizes && variant.sizes[selectedSizeIndex]) {
        basePrice = variant.sizes[selectedSizeIndex].price;
      }
    }

    if (hasFlashSale) {
      const flashDiscount = product.flashSale.discountPercentage || 0;
      return basePrice - (basePrice * flashDiscount) / 100;
    }

    const discountPercent = product.discountPercentage || 0;
    if (discountPercent > 0) {
      return basePrice - (basePrice * discountPercent) / 100;
    }

    return basePrice;
  };

  const getCurrentStock = () => {
    if (!product) return 0;

    if (
      product.hasVariants &&
      product.variants &&
      product.variants[selectedColorIndex]
    ) {
      const variant = product.variants[selectedColorIndex];
      if (variant.sizes && variant.sizes[selectedSizeIndex]) {
        return variant.sizes[selectedSizeIndex].countInStock;
      }
    }

    return product.countInStock || 0;
  };

  const getVariantInfo = () => {
    if (!product || !product.hasVariants) {
      return {
        hasVariants: false,
        colorIndex: null,
        colorName: "",
        colorHex: "",
        sizeIndex: null,
        sizeName: "",
        variantPrice: null,
        sku: "",
      };
    }

    const variant = product.variants[selectedColorIndex];
    const size = variant?.sizes?.[selectedSizeIndex];
    const variantBasePrice = size?.price || product.price;

    return {
      hasVariants: true,
      colorIndex: selectedColorIndex,
      colorName: variant?.color?.name || "",
      colorHex: variant?.color?.hexCode || "",
      sizeIndex: selectedSizeIndex,
      sizeName: size?.size || "",
      variantPrice: variantBasePrice,
      sku: size?.sku || "",
    };
  };

  const basePrice = product?.hasVariants
    ? product.variants?.[selectedColorIndex]?.sizes?.[selectedSizeIndex]
        ?.price || product.price
    : product?.price || 0;

  const finalPrice = getCurrentPrice();
  const currentStock = getCurrentStock();
  const displayImages = getDisplayImages();

  const displayDiscountPercent = hasFlashSale
    ? product.flashSale.discountPercentage
    : product?.discountPercentage || 0;

  const handleColorChange = (index) => {
    setSelectedColorIndex(index);
    if (product.variants[index]?.sizes?.length > 0) {
      setSelectedSizeIndex(0);
    }

    const variant = product.variants[index];
    if (variant?.color?.images?.length > 0) {
      setActiveImage(variant.color.images[0]);
    } else if (variant?.color?.image) {
      setActiveImage(variant.color.image);
    }
  };

  const handleSizeChange = (index) => {
    setSelectedSizeIndex(index);
  };

  const getProductForCart = () => {
    if (!product) return null;

    return {
      ...product,
      price: finalPrice,
      basePrice: basePrice,
      variantInfo: getVariantInfo(),
      image: displayImages[0] || product.images[0],
      images: displayImages,
      _flashSaleActive: hasFlashSale,
      _effectivePrice: finalPrice,
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId: product._id, rating, comment }).unwrap();
      refetch();
      toast.success("Review submitted");
      setComment("");
      setRating(0);
    } catch (error) {
      toast.error(error?.data?.message || "Error");
    }
  };


  const getCategoryHierarchy = (category) => {
  const hierarchy = [];
  let current = category;
  
  while (current) {
    hierarchy.unshift(current); // Add to beginning
    current = current.parent;
  }
  
  return hierarchy;
};

// In your component:
const categoryHierarchy = product?.category 
  ? getCategoryHierarchy(product.category) 
  : [];

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message}</Message>;

  return (
    <div className="bg-white min-h-screen font-figtree selection:bg-black selection:text-white">

 
<nav className="mt-[105px] py-6 border-b border-gray-50 bg-white/80 backdrop-blur-sm sticky top-[60px] z-40">
  <div className="container mx-auto px-6">
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold font-dosis flex-wrap">
      
      {/* Home */}
      <Link to="/" className="flex items-center gap-1.5 hover:text-black transition-colors px-2 py-1 rounded-lg hover:bg-gray-50">
        <FaHome className="text-[10px]" />
        <span>Home</span>
      </Link>

      <FaChevronRight className="text-[8px] text-gray-300" />

      {/* Shop */}
      <Link to="/shop" className="hover:text-black transition-colors px-2 py-1 rounded-lg hover:bg-gray-50">
        Shop
      </Link>

      {/* 🆕 All Parent Categories */}
      {categoryHierarchy.map((cat, index) => (
        <div key={cat._id} className="contents">
          <FaChevronRight className="text-[8px] text-gray-300" />
          <Link
            to={`/shop?category=${cat._id}`}
            className={`flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg ${
              index === categoryHierarchy.length - 1 
                ? 'hover:text-[#B88E2F] hover:bg-[#B88E2F]/5 text-[#B88E2F]' // Last category (main)
                : 'hover:text-gray-600 hover:bg-gray-50 text-gray-500' // Parent categories
            }`}
          >
            {index === categoryHierarchy.length - 1 ? (
              <FaFolder className="text-[10px]" />
            ) : (
              <FaFolderOpen className="text-[10px]" />
            )}
            <span className="truncate max-w-[100px]">{cat.name}</span>
          </Link>
        </div>
      ))}

      <FaChevronRight className="text-[8px] text-gray-300" />

      {/* Current Product */}
      <span className="text-gray-900 font-semibold truncate max-w-[200px] px-2 py-1 bg-gray-100 rounded-lg">
        {product.name}
      </span>
    </div>
  </div>
</nav>

      {/* Flash Sale Banner */}
      <AnimatePresence>
        {hasFlashSale && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white"
          >
            <div className="container mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaBolt className="text-2xl animate-pulse" />
                <div>
                  <span className="font-bold text-lg">
                    ⚡ Flash Sale Active!
                  </span>
                  <span className="ml-3 text-white/90">
                    {displayDiscountPercent}% OFF - Limited Time Only!
                  </span>
                </div>
              </div>
              {flashSaleInfo && (
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                  <FaClock />
                  <span className="font-mono font-bold">
                    Ends in: {flashSaleInfo.hours}h {flashSaleInfo.minutes}m
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Image Gallery */}
          <div className="lg:w-[45%]">
            <div className="sticky top-32 flex flex-col-reverse lg:flex-row gap-8">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar py-2 lg:max-h-[500px] flex-shrink-0">
                {displayImages.map((img, index) => (
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

              {/* Display Area */}
              <div
                className={`relative flex-1 bg-gradient-to-br from-[#fcfcfc] to-[#f5f5f5] rounded-[2.5rem] overflow-hidden aspect-square flex items-center justify-center p-12 border border-gray-100/50 group shadow-sm ${
                  hasFlashSale ? "ring-2 ring-red-200" : ""
                }`}
              >
                {/* Discount Badge */}
                {displayDiscountPercent > 0 && (
                  <div className="absolute top-8 left-8 z-10">
                    <div
                      className={`backdrop-blur-md border px-5 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col items-center ${
                        hasFlashSale
                          ? "bg-red-500/90 border-red-400 text-white"
                          : "bg-white/60 border-white/40"
                      }`}
                    >
                      <span
                        className={`text-[9px] font-black font-dosis uppercase tracking-[0.2em] leading-none mb-1 ${
                          hasFlashSale ? "text-white/80" : "text-gray-400"
                        }`}
                      >
                        {hasFlashSale ? "Flash Sale" : "Tech Offer"}
                      </span>
                      <span
                        className={`text-2xl font-black font-figtree ${
                          hasFlashSale ? "text-white" : "text-black"
                        }`}
                      >
                        -{Math.round(displayDiscountPercent)}%
                      </span>
                    </div>
                  </div>
                )}

                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  src={activeImage}
                  className="max-h-full object-contain mix-blend-multiply transition-transform duration-1000 ease-out group-hover:scale-[1.08]"
                />

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

          {/* Product Info */}
          <div className="lg:w-[55%] space-y-2">
            {/* ... Your existing product info code ... */}
            <header className="space-y-8">
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="w-full">
                    {/* Product Title */}
                    <h1 className="text-[18px] md:text-[22px] font-trebuchet text-[#3749BB] mb-3">
                      {product.name}
                    </h1>

                    {/* Flash Sale Timer */}
                    {hasFlashSale && flashSaleInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-3 bg-red-50 border border-red-200 rounded-xl p-3"
                      >
                        <FaBolt className="text-red-500 text-xl animate-pulse" />
                        <div>
                          <p className="text-red-600 font-bold text-sm">
                            Flash Sale Ends In:
                          </p>
                          <p className="text-red-500 font-mono font-bold text-lg">
                            {flashSaleInfo.hours}h {flashSaleInfo.minutes}m
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Variant Display */}
                    {product.hasVariants && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                          Selected:
                        </span>
                        <span className="text-[12px] font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                          {product.variants[selectedColorIndex]?.color?.name} /{" "}
                          {
                            product.variants[selectedColorIndex]?.sizes[
                              selectedSizeIndex
                            ]?.size
                          }
                        </span>
                      </div>
                    )}

                    {/* Info Badges Row */}
                    <div className="flex items-center flex-wrap gap-1">
                      {/* Price Badge */}
                      <div className="flex items-center gap-1 bg-[#F5F6FC] px-2 py-2 rounded-xl">
                        <span className="text-[14px] text-[#666666] font-normal font-trebuchet">
                          Price:
                        </span>
                        <span
                          className={`text-[14px] font-bold font-trebuchet ${
                            hasFlashSale ? "text-red-500" : "text-gray-900"
                          }`}
                        >
                          ৳{Math.round(finalPrice * qty).toLocaleString()}
                        </span>
                        {displayDiscountPercent > 0 && (
                          <span className="text-[12px] text-gray-400 line-through ml-2">
                            ৳{Math.round(basePrice * qty).toLocaleString()}
                          </span>
                        )}
                        {hasFlashSale && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-2 font-bold">
                            SAVE ৳{Math.round((basePrice - finalPrice) * qty)}
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-1 bg-[#F5F6FC] px-2 py-2 rounded-xl">
                        <span className="text-[14px] text-[#666666] font-normal font-trebuchet">
                          Status:
                        </span>
                        <span
                          className={`text-[14px] font-bold font-trebuchet ${
                            currentStock > 0
                              ? "text-emerald-600"
                              : "text-rose-500"
                          }`}
                        >
                          {currentStock > 0
                            ? `In Stock (${currentStock})`
                            : "Out of Stock"}
                        </span>
                      </div>

                      {/* Brand Badge */}
                      <div className="flex items-center gap-1 bg-[#F5F6FC] px-2 py-2 rounded-xl">
                        <span className="text-[14px] text-[#666666] font-normal font-trebuchet">
                          Brand:
                        </span>
                        <span className="text-[14px] font-bold font-trebuchet text-gray-900">
                          {product.brand || "AriX GeaR"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              {product.hasVariants &&
                product.variants &&
                product.variants.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-widest">
                      Select Color
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleColorChange(index)}
                          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                            selectedColorIndex === index
                              ? "border-black bg-black text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-gray-200"
                            style={{
                              backgroundColor: variant.color.hexCode || "#ccc",
                            }}
                          />
                          <span className="text-[12px] font-bold">
                            {variant.color.name}
                          </span>
                          {selectedColorIndex === index && (
                            <FaCheck className="text-[10px]" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Size Selection */}
              {product.hasVariants &&
                product.variants[selectedColorIndex]?.sizes &&
                product.variants[selectedColorIndex].sizes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-widest">
                      Select Size
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {product.variants[selectedColorIndex].sizes.map(
                        (size, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSizeChange(index)}
                            disabled={size.countInStock === 0}
                            className={`relative px-4 py-2 rounded-xl border-2 transition-all min-w-[60px] ${
                              selectedSizeIndex === index
                                ? "border-black bg-black text-white"
                                : size.countInStock === 0
                                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            <span className="text-[12px] font-bold">
                              {size.size}
                            </span>
                            {selectedSizeIndex === index && (
                              <FaCheck className="text-[10px] absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5" />
                            )}
                            {size.countInStock === 0 && (
                              <span className="text-[8px] block text-gray-400">
                                Out
                              </span>
                            )}
                          </motion.button>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Key Features */}
              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h4 className="text-[18px] font-normal text-gray-900 mb-2 font-trebuchet">
                    Key Features
                  </h4>
                  <div className="space-y-1">
                    {product.specifications.slice(0, 5).map((spec, idx) => (
                      <div
                        key={idx}
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
                  {product.specifications.length > 5 && (
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
                  )}
                </div>
              )}
            </header>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-3 items-center">
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
                  onClick={() => setQty(Math.min(currentStock || 10, qty + 1))}
                  disabled={qty >= currentStock}
                  className="w-8 h-8 flex items-center justify-center font-figtree font-normal text-[20px] rounded-xl text-[#270000] transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95 disabled:opacity-30"
                >
                  <FaPlus size={14} />
                </button>
              </div>

              <div className="flex-1">
                <AddToCartButton
                  product={getProductForCart()}
                  qty={qty}
                  buttonText={
                    hasFlashSale ? "⚡ Grab Flash Deal" : "Add to Cart"
                  }
                  isOrderNow={true}
                  className={`w-full py-5 rounded-2xl font-poppins text-lg tracking-wide shadow-md transition-all duration-300 hover:shadow-xl active:scale-[0.99] ${
                    hasFlashSale ? "bg-red-500 hover:bg-red-600 text-white" : ""
                  }`}
                />
              </div>
            </div>

            {/* Stock Warning */}
            {currentStock <= 5 && currentStock > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2"
              >
                <span className="text-orange-600 text-[12px] font-bold">
                  Only {currentStock} units left in this variant!
                </span>
              </motion.div>
            )}

            {/* Logistics Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-5 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <FaTruck className="text-blue-600 text-xl" />
                </div>
                <div className="space-y-2 w-full">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-dosis">
                    Shipping Info
                  </h4>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold font-figtree text-gray-900">
                      {product.shippingDetails?.shippingType === "free"
                        ? "Free"
                        : `৳${product.shippingDetails?.insideDhakaCharge || 80}`}
                    </span>
                  </div>
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

        {/* 🆕 RELATED PRODUCTS SECTION */}
        <div className="mt-24 pt-16 border-t border-gray-100">
          <div className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#B88E2F] rounded-full"></span>
              Related Products
            </h2>
            <p className="text-gray-500 text-sm mt-2 ml-5">
              More products you might be interested in
            </p>
          </div>

          {relatedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-[420px] bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : relatedError ? (
            <Message variant="danger">Failed to load related products</Message>
          ) : relatedProducts?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard p={relatedProduct} viewMode="grid" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">No related products found</p>
              <Link
                to="/shop"
                className="text-[#B88E2F] font-bold mt-2 inline-block hover:underline"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
