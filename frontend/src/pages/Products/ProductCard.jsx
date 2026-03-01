/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { FaBolt, FaShoppingCart, FaClock, FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { isFlashSaleActive, calculateEffectivePrice } from "../../components/ProductLogistics";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ProductCard = ({ p, viewMode }) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  const hasFlashSale = isFlashSaleActive(p);
  const finalPrice = calculateEffectivePrice(p);
  const originalPrice = p?.price || 0;
  const displayDiscountPercent = hasFlashSale 
    ? p?.flashSale?.discountPercentage 
    : p?.discountPercentage;

  // Countdown timer effect
  useEffect(() => {
    if (!hasFlashSale || !p?.flashSale?.endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      const endTime = new Date(p.flashSale.endTime);
      const bdEndTime = new Date(endTime.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      
      const difference = bdEndTime - now;

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
  }, [hasFlashSale, p]);

  const mainImage = Array.isArray(p?.images) && p.images.length > 0 
    ? p.images[0] 
    : p?.image || "/placeholder.jpg";

  const productPath = `/product/${p?.slug || p?._id}`;

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productToAdd = {
      ...p,
      _flashSaleActive: hasFlashSale,
      _effectivePrice: finalPrice
    };
    
    dispatch(addToCart({ ...productToAdd, qty: 1 }));
    toast.success(hasFlashSale ? "⚡ Flash Sale item added!" : "Added to cart");
  };

  const formatNum = (n) => String(n).padStart(2, '0');

  const showMonths = timeLeft.months > 0;
  const showDays = timeLeft.days > 0 || timeLeft.months > 0;

  // List view mode
  if (viewMode === "list") {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300"
      >
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden group">
          <Link to={productPath} className="block w-full h-full">
            <img 
              className="w-full h-full object-cover p-2 group-hover:scale-105 transition-transform duration-500" 
              src={mainImage} 
              alt={p?.name}
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
            <HeartIcon product={p} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
              {p?.brand || "AriX GeaR"}
            </p>
            <Link to={productPath}>
              <h3 className="text-lg font-bold text-gray-800 hover:text-red-500 transition-colors line-clamp-2 mb-2">
                {p?.name}
              </h3>
            </Link>
            
            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className={`text-xl font-bold ${hasFlashSale ? 'text-red-500' : 'text-gray-900'}`}>
                ৳{Math.round(finalPrice).toLocaleString("en-BD")}
              </span>
              {displayDiscountPercent > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ৳{originalPrice.toLocaleString("en-BD")}
                </span>
              )}
            </div>
          </div>

          {/* Countdown for flash sale */}
          {hasFlashSale && (
            <div className="bg-gray-900 text-white rounded-lg p-2 mb-3 max-w-xs">
              <div className="flex items-center justify-center gap-1 text-[9px] font-bold mb-1 text-red-400">
                <FaClock className="animate-pulse" />
                <span>FLASH SALE ENDS IN</span>
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
          )}

          {/* Progress bar for flash sale */}
          {hasFlashSale && p?.flashSale?.soldCount !== undefined && p?.flashSale?.totalCount && (
            <div className="max-w-xs mb-3">
              <div className="flex justify-between text-[9px] text-gray-500 mb-1 font-medium">
                <span>{Math.round((p.flashSale.soldCount / p.flashSale.totalCount) * 100)}% Sold</span>
                <span className="text-red-500 font-bold">{p.flashSale.totalCount - p.flashSale.soldCount} left</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(p.flashSale.soldCount / p.flashSale.totalCount) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={addToCartHandler}
              className="flex-1 bg-gray-900 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#B88E2F] transition-colors"
            >
              <FaShoppingCart size={14} />
              Add to Cart
            </button>
            <Link 
              to={productPath}
              className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <FaEye size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view - Compact for 4 columns (height reduced to 420px)
  return (
    <div 
      className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden min-h-fit flex flex-col"
      style={{ fontFamily: '"Trebuchet MS", sans-serif' }}
    >
      {/* Image - Smaller Height */}
      <div className="relative h-fit bg-gray-50 overflow-hidden flex-shrink-0">
        <Link to={productPath} className="block w-full h-full">
          <img 
            className="w-full h-full object-cover p-2 group-hover:scale-105 transition-transform duration-500" 
            src={mainImage} 
            alt={p?.name}
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {displayDiscountPercent > 0 && (
          <div className={`absolute top-2 left-2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm ${hasFlashSale ? 'bg-red-500' : 'bg-gray-800'}`}>
            {hasFlashSale && <FaBolt className="text-[7px]" />}
            -{displayDiscountPercent}%
          </div>
        )}

        {/* Heart Icon */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <HeartIcon product={p} />
        </div>

        {/* Quick Add Button */}
        <button
          onClick={addToCartHandler}
          className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white text-[10px] font-bold py-2 flex items-center justify-center gap-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <FaShoppingCart size={10} />
          Add to Cart
        </button>
      </div>

      {/* Content - Compact */}
      <div className="p-2.5 flex flex-col flex-grow">
        {/* Brand */}
        <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-0.5 h-3 flex-shrink-0">
          {p?.brand || "AriX GeaR"}
        </p>

        {/* Title - Fixed 2 Lines */}
        <Link to={productPath} className="block h-[32px] mb-1.5 flex-shrink-0">
          <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 hover:text-red-500 transition-colors leading-tight">
            {p?.name}
          </h3>
        </Link>

        {/* Price - Compact */}
        <div className="flex items-baseline gap-1.5 h-5 mb-1.5 flex-shrink-0">
          <span className={`text-sm font-bold ${hasFlashSale ? 'text-red-500' : 'text-gray-900'}`}>
            ৳{Math.round(finalPrice).toLocaleString("en-BD")}
          </span>
          {displayDiscountPercent > 0 && (
            <span className="text-[10px] text-gray-400 line-through">
              ৳{originalPrice.toLocaleString("en-BD")}
            </span>
          )}
        </div>

        {/* Countdown Area - Compact 60px */}
        <div className="h-[60px] mb-1.5 flex-shrink-0">
          {hasFlashSale ? (
            <div className="bg-gray-900 text-white rounded-lg p-1.5 h-full flex flex-col justify-center">
              <div className="flex items-center justify-center gap-0.5 text-[8px] font-bold mb-0.5 text-red-400">
                <FaClock className="animate-pulse text-[8px]" />
                <span>ENDS IN</span>
              </div>
              
              <div className="flex justify-center gap-0.5">
                {showMonths && (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="bg-white/10 rounded w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                        {formatNum(timeLeft.months)}
                      </div>
                      <span className="text-[6px] text-gray-400 uppercase">mo</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 self-start mt-0">:</span>
                  </>
                )}
                
                {showDays && (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="bg-white/10 rounded w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                        {formatNum(timeLeft.days)}
                      </div>
                      <span className="text-[6px] text-gray-400 uppercase">d</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 self-start mt-0">:</span>
                  </>
                )}
                
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 rounded w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                    {formatNum(timeLeft.hours)}
                  </div>
                  <span className="text-[6px] text-gray-400 uppercase">h</span>
                </div>
                
                <span className="text-[10px] font-bold text-gray-500 self-start mt-0">:</span>
                
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 rounded w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                    {formatNum(timeLeft.minutes)}
                  </div>
                  <span className="text-[6px] text-gray-400 uppercase">m</span>
                </div>
                
                <span className="text-[10px] font-bold text-gray-500 self-start mt-0">:</span>
                
                <div className="flex flex-col items-center">
                  <div className="bg-red-500 rounded w-5 h-5 flex items-center justify-center font-bold text-[10px] animate-pulse">
                    {formatNum(timeLeft.seconds)}
                  </div>
                  <span className="text-[6px] text-red-300 uppercase">s</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full" />
          )}
        </div>

        {/* Progress Bar Area - Compact 25px */}
        <div className="h-[25px] flex-shrink-0 mt-auto">
          {hasFlashSale && p?.flashSale?.soldCount !== undefined && p?.flashSale?.totalCount ? (
            <div>
              <div className="flex justify-between text-[8px] text-gray-500 mb-0.5 font-medium">
                <span>{Math.round((p.flashSale.soldCount / p.flashSale.totalCount) * 100)}% Sold</span>
                <span className="text-red-500 font-bold">{p.flashSale.totalCount - p.flashSale.soldCount} left</span>
              </div>
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(p.flashSale.soldCount / p.flashSale.totalCount) * 100}%` }}
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

export default ProductCard;