import { motion } from "framer-motion";

const Loader = () => {
  const brandText = "AriX GeaR";
  
  return (
    // ১. ব্যাকগ্রাউন্ড এখন একদম ক্লিন হোয়াইট
    <div className="h-screen w-full flex flex-col justify-center items-center bg-[#FFFFFF] overflow-hidden">
      
      {/* ২. Logo Core - হালকা শ্যাডো ও ক্লিন লুক */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-10">
        {/* Outer Ring - রেড বর্ডার (হালকা গ্লো) */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ 
            rotate: { duration: 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute w-full h-full border-[2px] border-dashed border-red-500/30 rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.05)]"
        />
        
        {/* Middle Ring - গোল্ডেন রিং */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-4/5 h-4/5 border border-dotted border-[#B88E2F]/40 rounded-full"
        />

        {/* Center AX Text - ডার্ক টেক্সট হোয়াইট ব্যাকগ্রাউন্ডে */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 flex flex-col items-center"
        >
          <span className="text-4xl font-black font-mono tracking-tighter text-gray-900">
            A<span className="text-red-600">X</span>
          </span>
        </motion.div>
      </div>

      {/* ৩. Brand Name - ডার্ক এবং রেড কম্বিনেশন */}
      <div className="text-center relative">
        <div className="flex space-x-2 mb-3">
          {brandText.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                repeat: Infinity,
                repeatDelay: 2.5,
                repeatType: "reverse"
              }}
              className={`text-3xl sm:text-5xl font-black tracking-[0.2em] ${
                char === "X" || index > 4 ? "text-red-600" : "text-gray-900"
              } ${index > 4 ? "font-serif italic" : "font-mono"}`}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        {/* ৪. Progress Bar - সফট গ্রে ও রেড গ্রেডিয়েন্ট */}
        <div className="w-64 h-[3px] bg-gray-100 mx-auto mt-6 overflow-hidden rounded-full border border-gray-50">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full bg-gradient-to-r from-transparent via-red-500 to-transparent"
          />
        </div>

        {/* ৫. Tagline - ক্লিন গ্রে টেক্সট */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] font-mono font-bold text-gray-400">
            Gadget & Tech
          </p>
          <div className="flex gap-1.5">
             <span className="w-1 h-1 bg-red-500/40 rounded-full" />
             <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
             <span className="w-1 h-1 bg-red-500/40 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* ৬. নিচের দিকে হালকা একটি ডিজাইন এলিমেন্ট */}
      <div className="absolute bottom-10 text-[9px] font-mono text-gray-300 uppercase tracking-[1em] opacity-50">
        AriX GeaR Terminal
      </div>
    </div>
  );
};

export default Loader;