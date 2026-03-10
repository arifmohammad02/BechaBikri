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

  // ✅ Local helpers
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
    <article 
      itemScope 
      itemType="https://schema.org/Product"
      className="group bg-white rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
      style={{ fontFamily: '"Trebuchet MS", sans-serif' }}
    >
      {/* Meta tags for invisible SEO data */}
      <meta itemProp="brand" content={product?.brand || "AriX GeaR"} />

      {/* Image Container - Using aspect-square to keep height uniform dynamically */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden shrink-0">
        <Link to={productPath} title={`View details of ${product.name}`} className="block w-full h-full">
          <img 
            itemProp="image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            src={mainImage} 
            alt={`Buy ${product.name} online`}
            loading="lazy"
          />
        </Link>

        {displayDiscountPercent > 0 && (
          <div className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm ${hasFlashSale ? 'bg-red-500' : 'bg-gray-800'}`}>
            {hasFlashSale && <FaBolt className="text-[8px]" aria-hidden="true" />}
            -{displayDiscountPercent}%
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <HeartIcon product={product} />
        </div>

        <button
          onClick={addToCartHandler}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-0 left-0 w-full bg-gray-900 text-white text-xs font-bold py-2.5 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 focus:outline-none focus:translate-y-0"
        >
          <FaShoppingCart size={12} aria-hidden="true" />
          Add to Cart
        </button>
      </div>

      {/* Content Area - Uses flex-grow to take remaining space */}
      <div className="p-3 flex flex-col grow">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
          {product?.brand || "AriX GeaR"}
        </p>

        {/* Title - Truncated to 1 line */}
        <Link to={productPath} title={product.name} className="block mb-1">
          <h3 itemProp="name" className="text-sm font-bold text-gray-800 truncate hover:text-red-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price Area - Structured with Microdata */}
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="flex items-center gap-2 mb-3">
          <meta itemProp="priceCurrency" content="BDT" />
          <meta itemProp="price" content={finalPrice} />
          <meta itemProp="availability" content={product.countInStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
          
          <span className={`text-base font-bold ${hasFlashSale ? 'text-red-500' : 'text-gray-900'}`}>
            ৳{Math.round(finalPrice).toLocaleString("en-BD")}
          </span>
          {displayDiscountPercent > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ৳{originalPrice.toLocaleString("en-BD")}
            </span>
          )}
        </div>

        {/* Bottom Elements pushed down using mt-auto */}
        <div className="mt-auto">
          {/* Countdown Area */}
          {hasFlashSale && (
            <div className="bg-gray-900 text-white rounded-lg p-2 flex flex-col justify-center mb-2">
              <div className="flex items-center justify-center gap-1 text-[9px] font-bold mb-1 text-red-400">
                <FaClock className="animate-pulse" aria-hidden="true" />
                <span>ENDS IN</span>
              </div>
              
              <div className="flex justify-center gap-1">
                {showMonths && (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="bg-white/10 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px]">{formatNum(timeLeft.months)}</div>
                      <span className="text-[7px] text-gray-400 uppercase">mo</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 self-start mt-0.5">:</span>
                  </>
                )}
                
                {showDays && (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="bg-white/10 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px]">{formatNum(timeLeft.days)}</div>
                      <span className="text-[7px] text-gray-400 uppercase">d</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 self-start mt-0.5">:</span>
                  </>
                )}
                
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px]">{formatNum(timeLeft.hours)}</div>
                  <span className="text-[7px] text-gray-400 uppercase">h</span>
                </div>
                <span className="text-xs font-bold text-gray-500 self-start mt-0.5">:</span>
                
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px]">{formatNum(timeLeft.minutes)}</div>
                  <span className="text-[7px] text-gray-400 uppercase">m</span>
                </div>
                <span className="text-xs font-bold text-gray-500 self-start mt-0.5">:</span>
                
                <div className="flex flex-col items-center">
                  <div className="bg-red-500 rounded w-6 h-6 flex items-center justify-center font-bold text-[11px] animate-pulse">{formatNum(timeLeft.seconds)}</div>
                  <span className="text-[7px] text-red-300 uppercase">s</span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar Area */}
          {hasFlashSale && product.flashSale?.soldCount !== undefined && product.flashSale?.totalCount && (
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
          )}
        </div>

      </div>
    </article>
  );
};

export default Product;