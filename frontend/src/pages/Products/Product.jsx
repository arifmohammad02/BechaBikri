/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import HeartIcon from "../../pages/Products/HeartIcon";
import { FaBolt, FaShoppingCart, FaClock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  // ✅ ADDED: Local helpers (since ProductLogistics removed)
  const isFlashSaleActive = (product) => {
    if (!product?.flashSale || !product.flashSale.isActive) return false;
    const now = new Date();
    const startTime = new Date(product.flashSale.startTime);
    const endTime = new Date(product.flashSale.endTime);
    return now >= startTime && now <= endTime;
  };

  const getVariantPrice = (product) => {
    if (!product.hasVariants || !product.variants) return product?.price || 0;
    
    const colorIndex = product.defaultColorIndex || 0;
    const sizeIndex = product.defaultSizeIndex || 0;
    
    const variant = product.variants[colorIndex];
    if (!variant?.sizes?.[sizeIndex]) return product?.price || 0;
    
    return variant.sizes[sizeIndex].price;
  };

  const calculateEffectivePrice = (product, basePrice) => {
    if (isFlashSaleActive(product)) {
      const flashDiscount = product.flashSale.discountPercentage || 0;
      return basePrice - (basePrice * flashDiscount) / 100;
    }
    
    const discountPercent = product?.discountPercentage || 0;
    if (discountPercent > 0) {
      return basePrice - (basePrice * discountPercent) / 100;
    }
    
    return basePrice;
  };

  const getMainImage = (product) => {
    if (!product.hasVariants || !product.variants?.length) {
      return Array.isArray(product?.images) && product.images.length > 0 
        ? product.images[0] 
        : product?.image || "/placeholder.jpg";
    }
    
    const colorIndex = product.defaultColorIndex || 0;
    const variant = product.variants[colorIndex];
    
    return variant?.color?.image || product.images?.[0] || "/placeholder.jpg";
  };

  // ✅ CHANGED: Use helpers with variant price
  const basePrice = getVariantPrice(product);
  const hasFlashSale = isFlashSaleActive(product);
  const finalPrice = calculateEffectivePrice(product, basePrice);
  const originalPrice = basePrice;
  const displayDiscountPercent = hasFlashSale 
    ? product.flashSale.discountPercentage 
    : product.discountPercentage;

  // ✅ CHANGED: Fixed timezone calculation
  useEffect(() => {
    if (!hasFlashSale || !product.flashSale?.endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(product.flashSale.endTime);
      
      const difference = endTime - now;

      if (difference > 0) {
        const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        const months = Math.floor(totalDays / 30);
        const remainingDays = totalDays % 30;
        
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          months: months,
          days: remainingDays,
          hours: hours,
          minutes: minutes,
          seconds: seconds
        });
      } else {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [hasFlashSale, product]);

  // ✅ CHANGED: Use getMainImage helper
  const mainImage = getMainImage(product);

  const productPath = `/product/${product.slug || product._id}`;

  // ✅ CHANGED: Fixed addToCartHandler with all required fields
  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const colorIndex = product.defaultColorIndex || 0;
    const sizeIndex = product.defaultSizeIndex || 0;
    const variant = product.variants?.[colorIndex];
    const sizeVariant = variant?.sizes?.[sizeIndex];
    
    const productToAdd = {
      ...product,
      _id: product._id,
      name: product.name,
      price: originalPrice, // Base price
      finalPrice: finalPrice, // After discount
      _flashSaleActive: hasFlashSale,
      _effectivePrice: finalPrice,
      effectivePrice: finalPrice,
      basePrice: originalPrice,
      _savings: originalPrice - finalPrice,
      savings: originalPrice - finalPrice,
      flashSale: product.flashSale, // Required for cartSlice isFlashSaleActive
      discountPercentage: product.discountPercentage,
      // ✅ ADDED: variantInfo for cartSlice isSameItem
      variantInfo: product.hasVariants ? {
        hasVariants: true,
        colorIndex: colorIndex,
        sizeIndex: sizeIndex,
        colorName: variant?.color?.name || "",
        colorHex: variant?.color?.hexCode || "",
        sizeName: sizeVariant?.size || "",
        variantPrice: sizeVariant?.price || originalPrice,
        sku: sizeVariant?.sku || "",
      } : {
        hasVariants: false,
        colorIndex: null,
        sizeIndex: null,
        colorName: "",
        sizeName: "",
        variantPrice: null,
        sku: "",
      },
      // ✅ ADDED: Required for shipping calculation in updateCart
      shippingDetails: product.shippingDetails || {
        shippingType: "weight-based",
        insideDhakaCharge: 80,
        outsideDhakaCharge: 150,
      },
      weight: product.weight || 0.5,
      image: mainImage,
      qty: 1,
    };
    
    dispatch(addToCart(productToAdd));
    toast.success(hasFlashSale ? "⚡ Flash Sale item added!" : "Added to cart");
  };

  const formatNum = (n) => String(n).padStart(2, '0');

  const showMonths = timeLeft.months > 0;
  const showDays = timeLeft.days > 0 || timeLeft.months > 0;

  return (
    <div 
      className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-[500px]"
      style={{ fontFamily: '"Trebuchet MS", sans-serif' }}
    >
      {/* Image - Fixed Height */}
      <div className="relative h-fit bg-gray-50 overflow-hidden flex-shrink-0">
        <Link to={productPath} className="block w-full h-full">
          <img 
            className="w-full h-full object-cover p-3 group-hover:scale-105 transition-transform duration-500" 
            src={mainImage} 
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {displayDiscountPercent > 0 && (
          <div className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm ${hasFlashSale ? 'bg-red-500' : 'bg-gray-800'}`}>
            {hasFlashSale && <FaBolt className="text-[8px]" />}
            -{displayDiscountPercent}%
          </div>
        )}

        {/* Heart Icon */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <HeartIcon product={product} />
        </div>

        {/* Quick Add Button */}
        <button
          onClick={addToCartHandler}
          className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-xs font-bold py-2.5 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <FaShoppingCart size={12} />
          Add to Cart
        </button>
      </div>

      {/* Content - Flexible with Fixed Areas */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Brand */}
        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 h-4 flex-shrink-0">
          {product?.brand || "AriX GeaR"}
        </p>

        {/* Title - Fixed 2 Lines */}
        <Link to={productPath} className="block h-[36px] mb-2 flex-shrink-0">
          <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 hover:text-red-500 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 h-6 mb-2 flex-shrink-0">
          <span className={`text-base font-bold ${hasFlashSale ? 'text-red-500' : 'text-gray-900'}`}>
            ৳{Math.round(finalPrice).toLocaleString("en-BD")}
          </span>
          {displayDiscountPercent > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ৳{originalPrice.toLocaleString("en-BD")}
            </span>
          )}
        </div>

        {/* Countdown Area - Fixed Height 70px */}
        <div className="h-[70px] mb-2 flex-shrink-0">
          {hasFlashSale ? (
            <div className="bg-gray-900 text-white rounded-lg p-2 h-full flex flex-col justify-center">
              <div className="flex items-center justify-center gap-1 text-[9px] font-bold mb-1 text-red-400">
                <FaClock className="animate-pulse" />
                <span>ENDS IN</span>
              </div>
              
              <div className="flex justify-center gap-1">
                {showMonths && (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="bg-white/10 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px]">
                        {formatNum(timeLeft.months)}
                      </div>
                      <span className="text-[7px] text-gray-400 uppercase">mo</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 self-start mt-0.5">:</span>
                  </>
                )}
                
                {showDays && (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="bg-white/10 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px]">
                        {formatNum(timeLeft.days)}
                      </div>
                      <span className="text-[7px] text-gray-400 uppercase">d</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 self-start mt-0.5">:</span>
                  </>
                )}
                
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px]">
                    {formatNum(timeLeft.hours)}
                  </div>
                  <span className="text-[7px] text-gray-400 uppercase">h</span>
                </div>
                
                <span className="text-xs font-bold text-gray-500 self-start mt-0.5">:</span>
                
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px]">
                    {formatNum(timeLeft.minutes)}
                  </div>
                  <span className="text-[7px] text-gray-400 uppercase">m</span>
                </div>
                
                <span className="text-xs font-bold text-gray-500 self-start mt-0.5">:</span>
                
                <div className="flex flex-col items-center">
                  <div className="bg-red-500 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px] animate-pulse">
                    {formatNum(timeLeft.seconds)}
                  </div>
                  <span className="text-[7px] text-red-300 uppercase">s</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full" />
          )}
        </div>

        {/* Progress Bar Area - Fixed Height 30px */}
        <div className="h-[30px] flex-shrink-0 mt-auto">
          {hasFlashSale && product.flashSale?.soldCount !== undefined && product.flashSale?.totalCount ? (
            <div>
              <div className="flex justify-between text-[9px] text-gray-500 mb-1 font-medium">
                <span>{Math.round((product.flashSale.soldCount / product.flashSale.totalCount) * 100)}% Sold</span>
                <span className="text-red-500 font-bold">{product.flashSale.totalCount - product.flashSale.soldCount} left</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(product.flashSale.soldCount / product.flashSale.totalCount) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="h-full" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;