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
    <div className="flex flex-col lg:flex-row bg-white md:p-6 space-y-4 lg:space-y-0">
      {/* Tabs Section */}
      <section className="lg:w-1/4 p-4 space-y-2 lg:border-r border-gray-300">
        {["Write Your Review", "All Reviews", "Related Products"].map(
          (tab, index) => (
            <div
              key={index}
              className={`cursor-pointer text-lg py-2 px-4 rounded-lg transition duration-200 ${
                activeTab === index + 1
                  ? "font-semibold bg-[#B88E2F] text-white border-2 border-[#B88E2F]"
                  : "hover:bg-gray-100 hover:text-gray-800 text-gray-600"
              }`}
              onClick={() => handleTabClick(index + 1)}
            >
              {tab}
            </div>
          )
        )}
      </section>

      {/* Tab Content Section */}
      <section className="lg:w-3/4 p-4">
        {/* Write Your Review */}
        {activeTab === 1 && (
          <div className="mt-4 bg-gray-50 p-6 rounded-lg shadow-md">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-4">
                  <label
                    htmlFor="rating"
                    className="block text-xl mb-2 text-gray-900 font-semibold"
                  >
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border rounded-lg w-full lg:w-2/3 text-gray-900 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div className="my-4">
                  <label
                    htmlFor="comment"
                    className="block text-xl mb-2 text-gray-900 font-semibold"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg w-full lg:w-2/3 text-gray-900 outline-none "
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-[#B88E2F] outline-none text-white py-2 px-4 rounded-lg transition duration-300 w-full lg:w-1/3 mx-auto"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-gray-800 font-poppins text-base">
                Please{" "}
                <Link to="/login" className="text-[#B88E2F] underline">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {/* All Reviews */}
        {activeTab === 2 && (
          <div className="mt-4 space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-gray-400">No Reviews</p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#242424] font-poppins font-normal p-4 rounded-lg "
                >
                  <div className="flex justify-between text-gray-300 ">
                    <strong className="ml-5 font-poppins font-normal">
                      {review.name}
                    </strong>
                    <span>{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <p className="ml-5 text-gray-300">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Products */}
        {activeTab === 3 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
