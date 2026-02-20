/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useGetPromotionalBannersQuery, useIncrementBannerClicksMutation } from "@redux/api/bannerApiSlice";
import { FaArrowRight, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date();
      if (difference > 0) {
        return {
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (!endTime) return null;

  return (
    <div className="flex items-center gap-2 text-xs font-black">
      <FaClock className="text-red-500" />
      <span className="bg-black text-white px-2 py-1 rounded">
        {String(timeLeft.hours).padStart(2, "0")}
      </span>
      :
      <span className="bg-black text-white px-2 py-1 rounded">
        {String(timeLeft.minutes).padStart(2, "0")}
      </span>
      :
      <span className="bg-black text-white px-2 py-1 rounded">
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

const PromotionalBanners = () => {
  const { data: banners, isLoading } = useGetPromotionalBannersQuery();
  const [incrementClicks] = useIncrementBannerClicksMutation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!banners?.length) return null;

  const handleClick = async (bannerId) => {
    await incrementClicks(bannerId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {banners.map((banner, index) => (
        <motion.div
          key={banner._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative group overflow-hidden rounded-2xl"
          style={{ backgroundColor: banner.backgroundColor }}
        >
          {/* Background Image */}
          {banner.image && (
            <div className="absolute inset-0">
              <img
                src={banner.image}
                alt={banner.headline}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${banner.backgroundColor}ee 0%, ${banner.backgroundColor}80 50%, transparent 100%)`
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="relative p-6 h-64 flex flex-col justify-end">
            {/* Offer Badge */}
            {banner.offerSettings?.offerValue > 0 && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                  {banner.offerSettings.offerType === "percentage" &&
                    `${banner.offerSettings.offerValue}% OFF`}
                  {banner.offerSettings.offerType === "bogo" && "B1G1 FREE"}
                  {banner.offerSettings.offerType === "fixed" &&
                    `৳${banner.offerSettings.offerValue} OFF`}
                  {banner.offerSettings.offerType === "free-shipping" && "FREE SHIP"}
                </span>
              </div>
            )}

            {/* Limited Time Badge */}
            {banner.offerSettings?.isLimitedTime && banner.offerSettings?.countdownEndTime && (
              <div className="absolute top-4 right-4">
                <CountdownTimer endTime={banner.offerSettings.countdownEndTime} />
              </div>
            )}

            {/* Text Content */}
            <h3 
              className="text-xl md:text-2xl font-black mb-1"
              style={{ color: banner.textColor }}
            >
              {banner.headline}
            </h3>
            <p 
              className="text-sm mb-4"
              style={{ color: banner.textColor, opacity: 0.8 }}
            >
              {banner.subHeadline}
            </p>

            {/* CTA */}
            <Link
              to={banner.link || "/shop"}
              onClick={() => handleClick(banner._id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-black uppercase tracking-wider text-xs transition-all hover:scale-105 w-fit"
              style={{
                backgroundColor: banner.buttonColor,
                color: banner.buttonTextColor,
              }}
            >
              {banner.buttonText}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PromotionalBanners;