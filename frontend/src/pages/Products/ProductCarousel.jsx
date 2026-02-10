import { useNavigate } from "react-router";
import { useState } from "react";
import { bannerData } from "../../static";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion"; 
import { FaArrowRight } from "react-icons/fa6";

const ProductCarousel = () => {
  const navigate = useNavigate();
  const [dotActive, setDotActive] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800, 
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true, 
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)", 
    pauseOnHover: false,
    beforeChange: (prev, next) => {
      setDotActive(next);
    },

    // 🔴 এখানে bottom-16 থেকে বাড়িয়ে আরও উপরে তোলার জন্য কাস্টম স্টাইল দেওয়া হয়েছে
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: "40px", width: "100%", zIndex: 30 }}>
        <ul className="flex items-center justify-center gap-3 m-0 p-0"> {dots} </ul>
      </div>
    ),

    customPaging: (i) => (
      <div
        className={`transition-all duration-500 rounded-full cursor-pointer ${
          i === dotActive 
          ? "w-10 md:w-16 h-2 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.7)]" 
          : "w-2.5 h-2 bg-white/40 hover:bg-white/70"
        }`}
      />
    ),
    
    responsive: [
      {
        breakpoint: 576,
        settings: {
          appendDots: (dots) => (
            <div style={{ position: "absolute", bottom: "30px", width: "100%", zIndex: 30 }}>
              <ul className="flex items-center justify-center gap-2 m-0 p-0"> {dots} </ul>
            </div>
          ),
        },
      },
    ],
  };

  return (
    <div className="w-full relative overflow-hidden rounded-xl md:rounded-[2.5rem] bg-black leading-[0]">
      <Slider {...settings}>
        {bannerData?.map((item, index) => (
          <div key={index} className="relative outline-none border-none">
            {/* Background Image */}
            <div className="relative h-[350px] sm:h-[500px] lg:h-[650px] w-full overflow-hidden">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: dotActive === index ? 1 : 1.1 }}
                transition={{ duration: 5 }}
                src={item?.image}
                alt="banner"
                className="w-full h-full object-cover block" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-24 z-20 leading-normal">
              <div className="container mx-auto">
                <AnimatePresence mode="wait">
                  {dotActive === index && (
                    <div className="flex flex-col gap-3 md:gap-6 max-w-[280px] sm:max-w-2xl">
                      <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-fit py-1 px-3 md:py-2 md:px-5 bg-blue-600 text-white text-[10px] md:text-xs uppercase font-black tracking-[0.2em] rounded-md"
                      >
                        {item?.sale}
                      </motion.span>

                      <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-2xl sm:text-5xl md:text-7xl font-mono font-black text-white leading-[1.1] tracking-tighter"
                      >
                        {item?.title.split(" ").map((word, i) => (
                          <span key={i} className={i % 2 !== 0 ? "text-[#B88E2F]" : "text-white"}>
                            {word}{" "}
                          </span>
                        ))}
                      </motion.h2>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-1"
                      >
                        <p className="text-white/70 text-[10px] md:text-lg font-mono tracking-widest uppercase">
                          {item?.discount}
                        </p>
                        <p className="text-white font-mono text-sm md:text-2xl mt-1">
                          From{" "}
                          <span className="text-[#B88E2F] font-black border-b-2 md:border-b-4 border-blue-600 pb-1">
                            ${item?.from}
                          </span>
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-4"
                      >
                        <button
                          onClick={() => navigate("/shop")}
                          className="group relative flex items-center gap-2 md:gap-4 bg-white text-black px-6 py-3 md:px-10 md:py-4 rounded-lg md:rounded-xl font-mono font-black uppercase tracking-widest text-[10px] md:text-sm hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl"
                        >
                          <span>Explore Gear</span>
                          <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;