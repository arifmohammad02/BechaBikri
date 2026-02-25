import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetHeroBannersQuery,
  useIncrementBannerClicksMutation,
} from "@redux/api/bannerApiSlice";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: banners, isLoading, error } = useGetHeroBannersQuery();
  const [incrementClicks] = useIncrementBannerClicksMutation();

  // Auto slide
  useEffect(() => {
    if (!isAutoPlaying || !banners?.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, banners]);


  if (error) {
    console.error("Banner fetch error:", error);
    return null;
  }


  const buttonTypeStyles = {
    default: { bg: "bg-gray-600", text: "SHOP NOW", icon: "" },
    "weekend-deal": { bg: "bg-purple-600", text: "WEEKEND DEAL", icon: "🔥" },
    "flash-sale": { bg: "bg-yellow-500", text: "FLASH SALE", icon: "⚡" },
    "big-sale": { bg: "bg-red-600", text: "BIG SALE", icon: "💥" },
    "limited-offer": { bg: "bg-orange-500", text: "LIMITED OFFER", icon: "⏰" },
    "special-offer": { bg: "bg-pink-500", text: "SPECIAL OFFER", icon: "🎁" },
    clearance: { bg: "bg-green-600", text: "CLEARANCE", icon: "🏷️" },
    "new-arrival": { bg: "bg-blue-500", text: "NEW ARRIVAL", icon: "✨" },
    "best-seller": { bg: "bg-amber-500", text: "BEST SELLER", icon: "⭐" },
    "trending-now": { bg: "bg-indigo-600", text: "TRENDING NOW", icon: "📈" },
    "hot-deal": { bg: "bg-red-700", text: "HOT DEAL", icon: "🌶️" },
    "mega-sale": { bg: "bg-violet-600", text: "MEGA SALE", icon: "🎉" },
    "seasonal-offer": {
      bg: "bg-emerald-500",
      text: "SEASONAL OFFER",
      icon: "🌸",
    },
    exclusive: { bg: "bg-slate-700", text: "EXCLUSIVE", icon: "💎" },
    "last-chance": { bg: "bg-rose-600", text: "LAST CHANCE", icon: "⚠️" },
    doorbuster: { bg: "bg-cyan-600", text: "DOORBUSTER", icon: "🚪" },
    "early-bird": { bg: "bg-sky-500", text: "EARLY BIRD", icon: "🐦" },
    "member-exclusive": {
      bg: "bg-teal-600",
      text: "MEMBER EXCLUSIVE",
      icon: "👤",
    },
    "bundle-deal": { bg: "bg-lime-600", text: "BUNDLE DEAL", icon: "📦" },
    "buy-one-get-one": {
      bg: "bg-fuchsia-600",
      text: "BUY 1 GET 1",
      icon: "🎊",
    },
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  const handleBannerClick = async (banner) => {
    await incrementClicks(banner._id);
  };

if (isLoading) {
    return (
      <div className="mx-auto mt-10 md:mt-6 lg:mt-5">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!banners?.length) return null;

  const currentBanner = banners[currentSlide];

  return (
    <div className="mx-auto mt-10 md:mt-6 lg:mt-5 xl:mt-10">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: currentSlide === 0 ? 1 : 0 }} 
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet={currentBanner.mobileImage || currentBanner.image}
            />
            <img
              src={currentBanner.image}
              fetchPriority="high"
              alt={currentBanner.headline}
              className="w-full h-full object-cover"
              loading="eager" 
              decoding="async"
            />
          </picture>

          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${currentBanner.backgroundColor}dd 0%, ${currentBanner.backgroundColor}10 20%, transparent 100%)`,
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-xl"
              >
                {/* Sale Badge */}
                {currentBanner.buttonType &&
                  currentBanner.buttonType !== "default" && (
                    <motion.span
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`inline-block px-4 py-2 ${buttonTypeStyles[currentBanner.buttonType]?.bg || "bg-red-600"} text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-md mb-4`}
                    >
                      {buttonTypeStyles[currentBanner.buttonType]?.icon}{" "}
                      {buttonTypeStyles[currentBanner.buttonType]?.text}
                    </motion.span>
                  )}
                {currentBanner.offerSettings?.offerValue > 0 && (
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-2 bg-red-600 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-md mb-4"
                  >
                    {currentBanner.offerSettings.offerType === "percentage" &&
                      `${currentBanner.offerSettings.offerValue}% OFF`}
                    {currentBanner.offerSettings.offerType === "bogo" &&
                      "BUY 1 GET 1 FREE"}
                    {currentBanner.offerSettings.offerType === "fixed" &&
                      `৳${currentBanner.offerSettings.offerValue} OFF`}
                    {currentBanner.offerSettings.offerType ===
                      "free-shipping" && "FREE SHIPPING"}
                  </motion.span>
                )}

                {/* Headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4"
                  style={{ color: currentBanner.textColor }}
                >
                  {currentBanner.headline}
                </motion.h2>

                {/* Sub Headline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm md:text-lg mb-6"
                  style={{ color: currentBanner.textColor, opacity: 0.8 }}
                >
                  {currentBanner.subHeadline}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    to={currentBanner.link || "/shop"}
                    onClick={() => handleBannerClick(currentBanner)}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: currentBanner.buttonColor,
                      color: currentBanner.buttonTextColor,
                    }}
                  >
                    {currentBanner.buttonText}
                    <FaArrowRight />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all z-10"
          >
            <FaArrowRight />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
      </div>
  );
};

export default HeroBanner;
