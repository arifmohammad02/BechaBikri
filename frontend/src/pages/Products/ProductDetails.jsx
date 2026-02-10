/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "@redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import ProductTabs from "./ProductTabs";
import Ratings from "./Ratings";
import { FaCheckCircle, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import AddToCartButton from "../../components/AddToCartButton";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeImage, setActiveImage] = useState("");

  const categoriesQuery = useFetchCategoriesQuery();
  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  useEffect(() => {
    if (product) {
      const allImages = product.images?.length > 0 ? product.images : product.image ? [product.image] : [];
      if (allImages.length > 0) setActiveImage(allImages[0]);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setComment("");
      setRating(0);
    } catch (error) {
      toast.error(error?.data?.message || "Error creating review");
    }
  };

  const discountedPrice = product?.price && product?.discountPercentage
    ? product.price - (product.price * product.discountPercentage) / 100
    : product?.price || 0;

  const discountAmount = product?.price && product?.discountPercentage
    ? (product.price * product.discountPercentage) / 100
    : 0;

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || "Failed to load product"}</Message>;
  if (!product) return <Message variant="danger">Product not found.</Message>;

  return (
    <div className="bg-[#FDFDFD] min-h-screen">
      {/* 🟢 ১. আধুনিক ব্রেডক্রাম্ব */}
      <div className="py-6 bg-[#F9F1E7]/30 border-b border-gray-100 mt-[100px]">
        <div className="container mx-auto px-4 flex items-center gap-3 text-sm md:text-base font-mono">
          <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/shop" className="text-gray-500 hover:text-blue-600">
            {categoriesQuery.data?.find((item) => item._id === product.category)?.name || "Shop"}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-bold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 🟢 ২. ইমেজ গ্যালারি সেকশন (Left) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-5">
            {/* থাম্বনেইল লিস্ট */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide">
              {(product.images?.length > 0 ? product.images : [product.image]).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    activeImage === img ? "border-blue-600 scale-105 shadow-md" : "border-gray-100 opacity-70"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>

            {/* মেইন ইমেজ */}
            <div className="flex-1 relative bg-white border border-gray-100 rounded-[2rem] overflow-hidden group shadow-sm h-[400px] md:h-[600px]">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain p-6 md:p-10 transition-transform duration-500 group-hover:scale-105"
              />
              {product.discountPercentage > 0 && (
                <div className="absolute top-5 left-5 bg-red-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                  -{product.discountPercentage}% OFF
                </div>
              )}
            </div>
          </div>

          {/* 🟢 ৩. প্রোডাক্ট ডিটেইলস (Right) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                {product.brand || "AriX Gear"}
              </span>
              <h1 className="text-3xl md:text-4xl font-mono font-black text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 py-2 border-y border-gray-50">
                <Ratings value={product.rating} />
                <span className="text-xs font-mono text-gray-400">
                  ({product.numReviews} Reviews)
                </span>
                <span className="h-4 w-[1px] bg-gray-200"></span>
                <span className={`text-xs font-bold ${product.countInStock > 0 ? "text-green-500" : "text-red-500"}`}>
                  {product.countInStock > 0 ? "● IN STOCK" : "● OUT OF STOCK"}
                </span>
              </div>
            </div>

            {/* প্রাইস সেকশন */}
            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-mono font-black text-gray-900">
                  ৳{discountedPrice?.toLocaleString("en-BD")}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-xl text-gray-400 line-through font-mono">
                    ৳{product.price?.toLocaleString("en-BD")}
                  </span>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <p className="text-red-500 text-sm font-bold">
                  You Save: ৳{discountAmount.toLocaleString("en-BD")}
                </p>
              )}
            </div>

            {/* অ্যাড টু কার্ট */}
            <div className="flex flex-col gap-4">
              <AddToCartButton
                product={product}
                qty={1}
                buttonText="Add to Cart"
                addedText="Added to Cart"
                isOrderNow={true}
              />
            </div>

            {/* ট্রাস্ট ব্যাজ সেকশন */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaTruck /></div>
                <div className="text-xs">
                  <p className="font-black text-gray-900">পণ্য হাতে পেয়ে টাকা দিন</p>
                  <p className="text-gray-500 uppercase font-mono tracking-tighter">Cash on Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><FaShieldAlt /></div>
                <div className="text-xs">
                  <p className="font-black text-gray-900">১০০% অরিজিনাল পন্য</p>
                  <p className="text-gray-500 uppercase font-mono tracking-tighter">Authentic Gear</p>
                </div>
              </div>
            </div>
            
            {/* বিশেষ নির্দেশনাবলী */}
            <div className="bg-[#B88E2F]/5 p-5 rounded-2xl border border-[#B88E2F]/20 space-y-3">
              {[
                "পন্যটি কিনতে “অর্ডার করুন” বাটনে চাপুন",
                "পুরো বাংলাদেশে হোম ডেলিভিরি সুবিধা",
                "১ টাকাও অগ্রিম দিতে হবে না"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <FaCheckCircle className="text-[#B88E2F]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🟢 ৪. ট্যাব এবং রিভিউ সেকশন */}
        <div className="mt-20">
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;