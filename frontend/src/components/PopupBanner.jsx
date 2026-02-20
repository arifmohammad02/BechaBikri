
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPopupBannerQuery, useIncrementBannerClicksMutation } from "@redux/api/bannerApiSlice";
import { FaTimes, FaCopy, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

const PopupBanner = () => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { data: banner } = useGetPopupBannerQuery();
  const [incrementClicks] = useIncrementBannerClicksMutation();

  useEffect(() => {
    if (!banner) return;

    // Check if popup was recently closed
    const lastClosed = localStorage.getItem(`popup_${banner._id}_closed`);
    const showAgainAfter = banner.popupSettings?.showAgainAfter || 24;
    
    if (lastClosed) {
      const hoursSince = (Date.now() - parseInt(lastClosed)) / (1000 * 60 * 60);
      if (hoursSince < showAgainAfter) return;
    }

    // Show popup after delay
    const delay = (banner.popupSettings?.delay || 5) * 1000;
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [banner]);

  const handleClose = () => {
    if (banner) {
      localStorage.setItem(`popup_${banner._id}_closed`, Date.now().toString());
    }
    setShow(false);
  };

  const handleCopyCode = () => {
    if (banner?.popupSettings?.couponCode) {
      navigator.clipboard.writeText(banner.popupSettings.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClick = async () => {
    if (banner) {
      await incrementClicks(banner._id);
    }
    handleClose();
  };

  if (!banner || !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div 
              className="relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: banner.backgroundColor }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
              >
                <FaTimes size={14} />
              </button>

              {/* Image */}
              {banner.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 text-center">
                <h3 
                  className="text-2xl font-black mb-2"
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

                {/* Coupon Code */}
                {banner.popupSettings?.couponCode && (
                  <div className="mb-4">
                    <div 
                      className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border-2 border-dashed"
                      style={{ borderColor: banner.buttonColor }}
                    >
                      <span 
                        className="font-black text-lg tracking-widest"
                        style={{ color: banner.buttonColor }}
                      >
                        {banner.popupSettings.couponCode}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="p-2 rounded transition-colors"
                        style={{ 
                          backgroundColor: banner.buttonColor,
                          color: banner.buttonTextColor 
                        }}
                      >
                        {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-xs text-green-600 mt-1 font-bold">
                        Code copied!
                      </p>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  to={banner.link || "/shop"}
                  onClick={handleClick}
                  className="inline-block w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: banner.buttonColor,
                    color: banner.buttonTextColor,
                  }}
                >
                  {banner.buttonText}
                </Link>

                {/* Discount Info */}
                {banner.popupSettings?.discountAmount > 0 && (
                  <p 
                    className="text-xs mt-3"
                    style={{ color: banner.textColor, opacity: 0.6 }}
                  >
                    Get ৳{banner.popupSettings.discountAmount} off on your first order!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PopupBanner;