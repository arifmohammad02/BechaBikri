/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "@redux/api/productApiSlice";
import ProductCard from "./ProductCard"; // SmallProduct থেকে ProductCard এ পরিবর্তন
import Loader from "../../components/Loader";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  const sanitizedDescription = DOMPurify.sanitize(product.description);

  return (
    <div className="flex flex-col space-y-12 mt-10">
      {/* 🟢 ১. আধুনিক ট্যাব ডিজাইন */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-wrap justify-center bg-gray-50/50 border-b border-gray-100">
          {["Description", "Write Review", "Reviews"].map((tab, index) => (
            <button
              key={index}
              className={`px-8 py-5 text-sm font-mono font-bold uppercase tracking-widest transition-all relative ${
                activeTab === index + 1
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => setActiveTab(index + 1)}
            >
              {tab}
              {activeTab === index + 1 && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* 🟢 ২. ট্যাব কন্টেন্ট (অ্যানিমেশন সহ) */}
        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Description */}
              {activeTab === 1 && (
                <div className="prose prose-blue max-w-full font-mono text-gray-600 leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                </div>
              )}

              {/* Write Review */}
              {activeTab === 2 && (
                <div className="max-w-2xl mx-auto">
                  {userInfo ? (
                    <form
                      onSubmit={submitHandler}
                      className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100"
                    >
                      <div>
                        <label className="block text-sm font-black uppercase tracking-widest text-gray-700 mb-3 font-mono">
                          Select Rating
                        </label>
                        <select
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          className="w-full md:w-64 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        >
                          <option value="">Choose...</option>
                          <option value="1">1 - Inferior</option>
                          <option value="2">2 - Decent</option>
                          <option value="3">3 - Great</option>
                          <option value="4">4 - Excellent</option>
                          <option value="5">5 - Exceptional</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-black uppercase tracking-widest text-gray-700 mb-3 font-mono">
                          Your Experience
                        </label>
                        <textarea
                          rows="4"
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="What did you like or dislike?"
                          className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={loadingProductReview}
                        className="bg-blue-600 hover:bg-black text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-blue-200"
                      >
                        {loadingProductReview
                          ? "Submitting..."
                          : "Submit Review"}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-10">
                      <p className="font-mono text-gray-500">
                        Please{" "}
                        <Link
                          to="/login"
                          className="text-blue-600 font-bold underline"
                        >
                          Login
                        </Link>{" "}
                        to share your thoughts.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* All Reviews */}
              {activeTab === 3 && (
                <div className="space-y-6">
                  {!product.reviews || product.reviews.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-3xl text-gray-400 font-mono">
                      No reviews yet. Be the first one!
                    </div>
                  ) : (
                    product.reviews?.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-black text-gray-900">
                              {review.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {review.createdAt.substring(0, 10)}
                            </span>
                          </div>
                          <p className="text-gray-600 font-mono text-sm">
                            {review.comment}
                          </p>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 rounded-xl">
                          <Ratings value={review.rating} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 🟢 ৩. Related Products Section (ProductCard এর সাথে হুবহু ম্যাচ) */}
      {/* 🟢 ৩. Related Products Section (AriX GeaR Premium Style) */}
      <section className="pt-20">
        <div className="flex flex-col items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* ছোট ট্যাগলাইন */}
            <span className="text-blue-600 font-mono font-bold tracking-[0.4em] uppercase text-[10px]">
              You Might Also Like
            </span>

            {/* মেইন টাইটেল */}
            <h2 className="text-3xl md:text-4xl font-mono font-black text-[#212B36] mt-2 mb-4 tracking-tighter uppercase">
              Related <span className="text-blue-600">Gear</span>
            </h2>

            {/* Signature Underline Animation (হোমপেজের সাথে ম্যাচ করে) */}
            <div className="flex justify-center">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-[3px] bg-gradient-to-r from-blue-600 to-[#B88E2F] rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* প্রোডাক্ট গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-5">
          {!data ? (
            <div className="col-span-full flex justify-center">
              <Loader />
            </div>
          ) : (
            data.slice(0, 4).map((p, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard p={p} />
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductTabs;
