/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import HeartIcon from "../../pages/Products/HeartIcon";
import { FaBolt, FaShoppingCart, FaClock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { isFlashSaleActive, calculateEffectivePrice } from "../../components/ProductLogistics";
import { useState, useEffect } from "react";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  const hasFlashSale = isFlashSaleActive(product);
  const finalPrice = calculateEffectivePrice(product);
  const originalPrice = product?.price || 0;
  const displayDiscountPercent = hasFlashSale 
    ? product.flashSale.discountPercentage 
    : product.discountPercentage;

  useEffect(() => {
    if (!hasFlashSale || !product.flashSale?.endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
      const endTime = new Date(product.flashSale.endTime);
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
  }, [hasFlashSale, product]);

  const mainImage = Array.isArray(product?.images) && product.images.length > 0 
    ? product.images[0] 
    : product?.image || "/placeholder.jpg";

  const productPath = `/product/${product.slug || product._id}`;

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productToAdd = {
      ...product,
      _flashSaleActive: hasFlashSale,
      _effectivePrice: finalPrice
    };
    
    dispatch(addToCart({ ...productToAdd, qty: 1 }));
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
            /* Empty space for non-flash items */
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