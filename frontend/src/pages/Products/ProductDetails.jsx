import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "@redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

import HeartIcon from "./HeartIcon";
import ProductTabs from "./ProductTabs";
import Ratings from "./Ratings";
// import AddToCartButton from "../../components/AddToCartButton";
import { FaCheck } from "react-icons/fa";
import { addToCart } from "../../redux/features/cart/cartSlice";
// import OrderNowButton from "../../components/OrderNowButton";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const errorMessage =
        error?.data?.message || error.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const discountedPrice =
    product?.price && product?.discountPercentage
      ? product.price - (product.price * product.discountPercentage) / 100
      : product?.price || 0;

  const discountAmount =
    product?.price && product?.discountPercentage
      ? (product.price * product.discountPercentage) / 100
      : 0;

  // Determine shipping charge safely
  const shipping =
    product?.shippingCharge !== undefined
      ? product.shippingCharge === 0
        ? "Free Shipping"
        : `৳${product.shippingCharge}`
      : "Shipping not available";

  // Guard against undefined product data
  if (isLoading) return <Loader />;
  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || "Failed to load product details"}
      </Message>
    );
  }

  // Guard against undefined product data
  if (isLoading) return <Loader />;
  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || "Failed to load product details"}
      </Message>
    );
  }

  if (!product) {
    return <Message variant="danger">Product not found.</Message>;
  }

  // console.log(product);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="bg-white min-h-screen h-full pt-12 px-3 xs:px-0 container mx-auto">
      <div className="pb-10">
        {/* Go Back Link */}
        <div className="py-10">
          <Link
            to="/"
            class="text-[#242424] bg-white border border-[#B88E2F] outline-none  font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2   "
          >
            Go Back
          </Link>
        </div>

        {/* Product Section */}
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

                <div>
                  <h5 className="text-base text-[#B88E2F] font-medium font-poppins">
                    {product.isFeatured ? "Sale!" : "New!"}
                  </h5>
                  <h1 className="text-2xl font-normal text-[#242424] mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl text-[#B88E2F] font-medium font-poppins">
                      ₹{discountedPrice?.toFixed(2)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <>
                        <span className="text-sm text-[#9F9F9F] font-medium font-poppins line-through">
                          ₹{product.price}
                        </span>
                        <span className="bg-[#B88E2F] text-white text-xs font-semibold px-2 py-1 rounded">
                          -{product.discountPercentage}% Off
                        </span>
                        <span className="text-sm font-medium font-poppins text-[#B88E2F]">
                          You save: ₹{discountAmount.toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-base font-normal font-poppins text-[#9F9F9F]">
                    <p>Brand: {product.brand}</p>
                    <p>
                      Stock:{" "}
                      {product.countInStock > 0 ? "Available" : "Out of Stock"}
                    </p>
                    <p>
                      Shipping:{" "}
                      <span className="font-semibold">{shipping}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center space-x-4">
                    {/* <AddToCartButton
                      product={product}
                      qty={1}
                      buttonText="Add to Cart"
                      addedText="Added to Cart"
                      isOrderNow={true} // This enables the "Order Now" button
                     
                    /> */}

                    {/* <OrderNowButton
                      product={product}
                      item={product}
                      qty={1}
                      customStyles="my-custom-class"
                    /> */}

                    <div className="btn-container">
                      <button
                        onClick={addToCartHandler}
                        disabled={product.countInStock === 0}
                        className="bg-[#B88E2F] text-lg font-poppins font-medium text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                      >
                        Add To Cart
                      </button>
                    </div>

                    {/* <button
                      className="text-gray-500 hover:text-red-500 transition-colors"
                      title="Add to Wishlist"
                    >
                    </button> */}
                    <div className="flex items-center space-x-2 text-xl">
                      <HeartIcon product={product} />
                    </div>
                  </div>

                  {/* Review Rating and Count */}
                  <div className="mt-6 flex items-center space-x-2">
                    <Ratings value={product.rating} />
                    <span className="text-[#9F9F9F] text-base font-medium font-poppins">
                      ({product.numReviews}{" "}
                      {product.numReviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <h3 className="text-xl  mb-3 font-medium font-poppins text-black/80">
                      Description
                    </h3>
                    <p className="text-gray-600 font-medium font-poppins">
                      {isExpanded
                        ? product.description
                        : `${product.description.substring(0, 150)}${
                            product.description.length > 150 ? "..." : ""
                          }`}
                    </p>
                    {product.description.length > 150 && (
                      <button
                        className="text-purple-500 text-sm font-poppins mt-2"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        {isExpanded ? "See Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-8 py-4">
            <div className="space-y-4 font-poppins font-normal">
              <div className="flex items-start space-x-3">
                <FaCheck />
                <label className="text-sm text-[#9F9F9F]">
                  পন্যটি কিনতে “অর্ডার করুন” বাটনে চাপুন
                </label>
              </div>
              <div className="flex items-start space-x-3">
                <FaCheck />
                <label className="text-sm text-[#9F9F9F]">
                  পুরো বাংলাদেশে হোম ডেলিভিরি মাধ্যমে পণ্য পৌঁছানো হয়
                </label>
              </div>
              <div className="flex items-start space-x-3">
                <FaCheck />
                <label className="text-sm text-[#9F9F9F]">
                  ১টাকাও এডভান্স নেওয়া হয় না
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center mt-10 p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="text-sm text-gray-600">
                <span className="text-xl text-[#242424] font-normal font-poppins">
                  Guaranteed Delivery
                </span>
                <span className="mx-2">|</span>
                <span className="text-base text-[#242424] font-medium font-poppins">
                  No Advance
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt="COD Delivery"
                  className="h-12 w-12 rounded-lg"
                />
                <span className="text-xl text-[#B88E2F] font-bold font-inter">
                  Cash On Delivery
                </span>
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
      </div>
    </div>
  );
};

export default ProductDetails;
