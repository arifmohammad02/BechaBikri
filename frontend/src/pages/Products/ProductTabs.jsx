import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "@redux/api/productApiSlice";
import SmallProduct from "./SmallProduct ";
import Loader from "../../components/Loader";

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

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col bg-white space-y-6 ">
      {/* Tabs Section */}
      <div className="border">
        <section className="w-full flex justify-center  space-x-6 px-4 border py-3">
          {["Description", "Write Your Review", "All Reviews"].map(
            (tab, index) => (
              <div
                key={index}
                className={`cursor-pointer text-[17px] font-serif font-bold transition-all duration-300 ${
                  activeTab === index + 1
                    ? "border-b-2 border-[#B88E2F] text-black"
                    : "text-gray-600"
                }`}
                onClick={() => handleTabClick(index + 1)}
              >
                {tab}
              </div>
            )
          )}
        </section>

        {/* Tab Content Section */}
        <section className="w-full px-4 py-6">
          {/* Description */}

          {activeTab === 1 && (
            <div className="mt-4 space-y-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {/* Write Your Review */}
          {activeTab === 2 && (
            <div className="mt-4 border p-4 space-y-6">
              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-4">
                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-lg font-normal font-serif text-gray-800 mb-2"
                    >
                      Rating
                    </label>
                    <select
                      id="rating"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="min-w-xs p-2 border rounded-md focus:ring-2 focus:ring-[#B88E2F]"
                    >
                      <option value="">Select</option>
                      <option value="1">Inferior</option>
                      <option value="2">Decent</option>
                      <option value="3">Great</option>
                      <option value="4">Excellent</option>
                      <option value="5">Exceptional</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-2xl font-serif font-semibold text-gray-800 mb-2"
                    >
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#B88E2F]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingProductReview}
                    className="bg-[#B88E2F] font-serif font-normal text-[15px] text-white py-2 px-6 rounded-lg hover:bg-[#9b7827] transition-all"
                  >
                    Submit
                  </button>
                </form>
              ) : (
                <p className="text-gray-700 text-center text-[15px] font-medium font-serif">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-[#B88E2F] font-semibold underline"
                  >
                    sign in
                  </Link>{" "}
                  to write a review.
                </p>
              )}
            </div>
          )}

          {/* All Reviews */}
          {activeTab === 3 && (
            <div className="space-y-4">
              {product.reviews.length === 0 ? (
                <p className="text-center text-[15px] font-medium font-serif text-gray-500">
                  No Reviews Available
                </p>
              ) : (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border p-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-2xl font-serif">{review.name}</span>
                      <span className="text-sm">
                        {review.createdAt.substring(0, 10)}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] font-medium font-serif">{review.comment}</p>
                    <Ratings value={review.rating} />
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>

      {/* Related Products Section (Always Visible Below Tabs) */}
      <section className="w-full py-6">
        <span className="border-l-[4px] h-10 mb-5 border-[#B88E2F] flex items-center pl-3">
        <h2 className="text-3xl font-bold font-mono text-gray-800">
          Related Products
        </h2>
        </span>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {!data ? (
            <Loader />
          ) : (
            data.map((product) => (
              <div
                key={product._id}
                className="transition-transform duration-300 hover:scale-102"
              >
                <SmallProduct product={product} className="transition-all" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductTabs;
