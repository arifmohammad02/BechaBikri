import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "@redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

import { FaBox, FaStar, FaStore, FaCartPlus } from "react-icons/fa";

import HeartIcon from "./HeartIcon";
import ProductTabs from "./ProductTabs";
import Ratings from "./Ratings";
import AddToCartButton from "../../components/AddToCartButton";

const ProductDetails = () => {
  const { id: productId } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      if (
        error.status === 400 &&
        error?.data?.message === "Product already reviewed"
      ) {
        toast.error("You have already reviewed this product.");
      } else {
        toast.error(
          error?.data?.message ||
          error.message ||
          "An unexpected error occurred"
        );
      }
    }
  };


  return (
    <div className="bg-white min-h-screen h-full pt-12 px-3 xs:px-0 container mx-auto">
      <div className="pb-10 ">
        {/* Go Back Link */}
        <div className="py-4">
          <Link
            to="/"
            className="text-gray-800 font-semibold hover:underline hover:text-pink-600 transition-all"
          >
            Go Back
          </Link>
        </div>

        {/* Product Section */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <div className="flex flex-col">
            <div className="py-8 bg-white md:py-16 antialiased border border-gray-300 rounded-md overflow-hidden">
              <div className="max-w-screen-xl px-2 md:px-4 mx-auto 2xl:px-0">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                  <div className="shrink-0 max-w-md lg:max-w-lg mx-auto bg-white overflow-hidden">
                    <img
                      className="w-full"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>

                  <div className="mt-6 sm:mt-8 lg:mt-0">
                    <div>
                      <h1 className="text-xl font-semibold text-black sm:text-2xl">
                        {isExpanded
                          ? product.name
                          : product.name.substring(0, 80) +
                          (product.name.length > 80 ? "..." : "")}
                      </h1>
                      {/* See More / See Less Button */}
                      {product.name.length > 80 && (
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="text-pink-500 text-sm mt-2 hover:underline"
                        >
                          {isExpanded ? "See Less" : "See More"}
                        </button>
                      )}
                    </div>
                    <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                      <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                        BDT-{product.price}
                      </p>

                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <Link className="text-sm font-medium leading-none text-gray-900 hover:no-underline">
                          <h1 className="flex items-center">
                            <FaStore className="mr-2 text-pink-600" /> Brand:{" "}
                            {product.brand}
                          </h1>
                        </Link>
                        <Link
                          href="#"
                          className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline"
                        >
                          <h1 className="flex items-center">
                            <FaStar className="mr-2 text-pink-600" /> Reviews:{" "}
                            {product.numReviews}
                          </h1>
                        </Link>
                        <Link>
                          <h1 className="flex items-center">
                            <FaBox className="mr-2 text-pink-600" /> In Stock:{" "}
                            {product.countInStock}
                          </h1>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                      <Link
                        title=""
                        className="flex items-center justify-center w-fit py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        role="button"
                      >
                        <HeartIcon
                          product={product}
                          className="w-5 h-5 -ms-2 me-2 text-current"
                        />
                      </Link>
                    </div>

                    <div className="flex flex-col w-fit sm:flex-row sm:items-center sm:space-x-4 my-4 gap-3 sm:gap-0">
                      <Ratings
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                    </div>
                    <div>
                      <AddToCartButton product={product} />
                    </div>

                    <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
                    <p className="mb-6 text-gray-500 dark:text-gray-400">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="w-full mt-8 bg-gray-100 border border-gray-300 rounded-md overflow-hidden">
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
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
