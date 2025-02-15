import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { FaCheck } from "react-icons/fa";
import AddToCartButton from "../../components/AddToCartButton";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const categoriesQuery = useFetchCategoriesQuery();

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

  return (
    <div className="">
      <div className="py-8 bg-[#E8E8E8] mt-[100px]">
        <div className="container mx-auto flex items-center gap-3 md:gap-5 ">
          <Link
            to="/"
            className="text-[#000000] font-medium font-poppins text-[14px] md:text-[18px]"
          >
            Home
          </Link>
          <span className="text-[#000000] font-medium font-poppins text-[14px] md:text-[18px]">
            /
          </span>
          <Link
            to="/shop"
            className="text-[#000000] font-medium font-poppins text-[14px] md:text-[18px]"
          >
            {categoriesQuery.data &&
              categoriesQuery.data.find((item) => item._id === product.category)
                ?.name}
          </Link>
          <span className="text-[#000000] font-medium font-poppins text-[14px] md:text-[18px]">
            /
          </span>
          <span className="text-[#000000] font-medium font-poppins text-[14px] md:text-[18px]">
            {product.name}
          </span>
        </div>
      </div>
      <div className="bg-white min-h-screen h-full pt-8 px-3 xs:px-0 container mx-auto">
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
                  <div className="border-b-[1px] border-opacity-5">
                    <h1 className="text-[28px] font-Dosis font-semibold text-[#202435]">
                      {product.name}
                    </h1>

                    {/* Review Rating and Count */}
                    <div className="flex items-center gap-3">
                      <div className="">
                        <p className="text-[#C2C2D3] text-[13px] font-inter font-normal">
                          Brand:{" "}
                          <span className="text-[#223994] text-[13px] font-inter font-normal">
                            {product.brand}
                          </span>
                        </p>
                      </div>
                      <span className="border h-9 border-opacity-5 "></span>
                      <div className="my-4 flex items-center space-x-1">
                        <Ratings value={product.rating} />
                        <span className="text-[#9F9F9F] text-[12px] font-medium font-poppins">
                          ({product.numReviews}{" "}
                          {product.numReviews === 1 ? "Review" : "Reviews"})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 my-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[30px] text-[#98928E] font-normal font-poppins line-through">
                        ₹{product.price}
                      </span>
                      {product.discountPercentage > 0 && (
                        <>
                          <span className="text-[30px] text-[#ED1D24] font-semibold font-poppins">
                            ₹{discountedPrice?.toFixed(2)}
                          </span>
                          {/* <span className="bg-[#B88E2F] text-white text-xs font-semibold px-2 py-1 rounded">
                          -{product.discountPercentage}% Off
                        </span> */}
                        </>
                      )}
                    </div>
                    <span className="text-[16px] font-normal font-Inter bg-[#FF013D] text-[#FFFFFF] px-2 py-1 w-fit mt-5 md:mt-0">
                      Save{" "}
                      <span className="font-semibold text-[25px]">
                        ₹{discountAmount.toFixed(2)}
                      </span>
                    </span>
                  </div>
                  <div className="text-base font-normal font-poppins text-[#9F9F9F]">
                    <p className="text-[#00B858] text-[12px] font-poppins bg-[#E5F8ED] font-bold w-fit px-3 py-1 rounded-lg">
                      {product.countInStock > 0 ? "IN STOCK" : "Out of Stock"}
                    </p>
                    {/* <p>
                      Shipping:{" "}
                      <span className="font-semibold">{shipping}</span>
                    </p> */}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center space-x-4">
                    <AddToCartButton
                      product={product}
                      qty={1}
                      buttonText="Add to Cart"
                      addedText="Added to Cart"
                      isOrderNow={true} // This enables the "Order Now" button
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-8 py-4">
            <div className="space-y-4 font-poppins font-normal">
              <div className="flex items-start space-x-3">
                <FaCheck />
                <label className="text-sm text-black/80">
                  পন্যটি কিনতে “অর্ডার করুন” বাটনে চাপুন
                </label>
              </div>
              <div className="flex items-start space-x-3">
                <FaCheck />
                <label className="text-sm text-black/80">
                  পুরো বাংলাদেশে হোম ডেলিভিরি মাধ্যমে পণ্য পৌঁছানো হয়
                </label>
              </div>
              <div className="flex items-start space-x-3">
                <FaCheck />
                <label className="text-sm text-black/80">
                  ১টাকাও এডভান্স নেওয়া হয় না
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center mt-10 p-4 border border-opacity-10 shadow-sm">
              <div className="text-sm text-gray-600">
                <span className="text-[16px] md:text-xl text-[#242424] font-semibold font-poppins">
                  Guaranteed Delivery
                </span>
                <span className="mx-2">|</span>
                <span className="text-[14px] md:text-[15px]  text-[#242424] font-medium font-poppins">
                  No Advance
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt="COD Delivery"
                  className="h-8 w-8 md:h-12 md:w-12 rounded-lg"
                />
                <span className="text-[18px] md:text-2xl first-line:text-[#B88E2F] font-extrabold font-Dosis">
                  ক্যাশ অন ডেলিভারি
                </span>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="w-full mt-8 ">
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
