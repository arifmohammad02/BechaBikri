// /* eslint-disable react/prop-types */
// import { Link } from "react-router-dom";
// import HeartIcon from "./HeartIcon";
// import { FaArrowRight, FaBagShopping, FaEye } from "react-icons/fa6";
// import { motion } from "framer-motion";

// const SmallProduct = ({ product }) => {
//   const truncateName = (name) => {
//     return name.length > 25 ? name.substring(0, 25) + "..." : name;
//   };

//   const displayImage =
//     Array.isArray(product?.images) && product.images.length > 0
//       ? product.images[0]
//       : product?.image || "/placeholder.jpg";

//   const discountedPrice =
//     product.discountPercentage > 0
//       ? product.price - (product.price * product.discountPercentage) / 100
//       : product.price;

//   const productPath = `/product/${product.slug || product._id}`;

//   return (
//     <div className="group relative w-full bg-white rounded-[1.5rem] p-3 border border-gray-100 hover:border-blue-100 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] transition-all duration-500 ease-in-out">
      
//       {/* 🟢 ১. ইমেজ কন্টেইনার (বড় কার্ডের মতো সেন্টারড আইকন সহ) */}
//       <div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-[#fcfcfc]">
//         <Link to={productPath}>
//           <motion.img
//             whileHover={{ scale: 1.1 }}
//             transition={{ duration: 0.6 }}
//             className="w-full h-full object-contain p-4"
//             src={displayImage}
//             alt={product.name}
//           />
//         </Link>

//         {/* ব্যাজ */}
//         <div className="absolute top-2 left-2 flex flex-col gap-1">
//           {product.discountPercentage > 0 && (
//             <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md shadow-lg uppercase">
//               {product.discountPercentage}% OFF
//             </span>
//           )}
//         </div>

//         {/* 🟢 মাঝখানের আইকনগুলো (বড় কার্ডের মতো ডিজাইন) */}
//         <div className="absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
//           <Link to={productPath} className="p-2.5 bg-white/90 backdrop-blur-md rounded-lg text-gray-800 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
//             <FaEye size={14} />
//           </Link>
//           <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-lg text-gray-800 hover:bg-[#B88E2F] hover:text-white transition-all shadow-lg">
//             <FaBagShopping size={14} />
//           </button>
//         </div>

//         {/* Heart Icon (Top Right) */}
//         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 translate-y-[-5px] group-hover:translate-y-0 transition-all duration-300">
//           <HeartIcon product={product} />
//         </div>
//       </div>

//       {/* 🟢 ২. টেক্সট কন্টেন্ট (সেন্টারড ডিজাইন) */}
//       <div className="px-1 py-4 text-center">
//         <span className="text-[8px] font-black text-blue-600/60 uppercase tracking-[0.3em] font-mono">
//           {product?.brand || "AriX GeaR"}
//         </span>
        
//         <Link to={productPath}>
//           <h5 className="text-[14px] font-mono font-bold text-gray-800 mt-1 hover:text-blue-600 transition-colors line-clamp-1">
//             {truncateName(product.name)}
//           </h5>
//         </Link>

//         {/* প্রাইস */}
//         <div className="mt-2 flex flex-col items-center">
//           <div className="flex items-center gap-2">
//             <span className="text-[16px] font-black text-gray-900">
//               ৳{Math.round(discountedPrice).toLocaleString("en-BD")}
//             </span>
//             {product.discountPercentage > 0 && (
//               <span className="text-[10px] text-gray-400 line-through">
//                 ৳{product.price.toLocaleString("en-BD")}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* 🟢 ৩. বটম অ্যাকশন (Details with Line Animation) */}
//         <div className="mt-4 pt-2 border-t border-gray-50">
//           <Link
//             to={productPath}
//             className="group/btn relative flex items-center justify-center gap-2 w-full py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all"
//           >
//             <span>Details</span>
//             <FaArrowRight className="text-[9px] group-hover/btn:translate-x-1 transition-transform" />
            
//             {/* Signature Underline - সেন্টারে */}
//             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-blue-600 to-[#B88E2F] group-hover/btn:w-1/2 transition-all duration-500" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SmallProduct;