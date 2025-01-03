// import { useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   useGetProductDetailsQuery,
//   useCreateReviewMutation,
// } from "@redux/api/productApiSlice";
// import Loader from "../../components/Loader";
// import Message from "../../components/Message";

// import HeartIcon from "./HeartIcon";
// import ProductTabs from "./ProductTabs";
// import Ratings from "./Ratings";
// // import AddToCartButton from "../../components/AddToCartButton";
// import { FaCheck } from "react-icons/fa";
// import OrderNowButton from "../../components/OrderNowButton";

// const ProductDetails = () => {
//   const { id: productId } = useParams();
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [isExpanded, setIsExpanded] = useState(false);

//   const {
//     data: product,
//     isLoading,
//     refetch,
//     error,
//   } = useGetProductDetailsQuery(productId);
//   const { userInfo } = useSelector((state) => state.auth);

//   const [createReview, { isLoading: loadingProductReview }] =
//     useCreateReviewMutation();

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       await createReview({
//         productId,
//         rating,
//         comment,
//       }).unwrap();
//       refetch();
//       toast.success("Review created successfully");
//     } catch (error) {
//       const errorMessage =
//         error?.data?.message || error.message || "An unexpected error occurred";
//       toast.error(errorMessage);
//     }
//   };

//   // Calculate discounted price safely
//   const discountedPrice =
//     product?.discountPercentage > 0
//       ? product.price - (product.price * product.discountPercentage) / 100
//       : product?.price;

//   const discountAmount =
//     product?.discountPercentage > 0
//       ? (product.price * product.discountPercentage) / 100
//       : 0;

//   // Determine shipping charge safely
//   const shipping =
//     product?.shippingCharge === 0
//       ? "Free Shipping"
//       : `৳${product?.shippingCharge}`;

//   // Guard against undefined product data
//   if (isLoading) return <Loader />;
//   if (error) {
//     return (
//       <Message variant="danger">
//         {error?.data?.message || "Failed to load product details"}
//       </Message>
//     );
//   }

//   if (!product) {
//     return <Message variant="danger">Product not found.</Message>;
//   }

//   console.log(product);

//   return (
//     <div className="bg-white min-h-screen h-full pt-12 px-3 xs:px-0 container mx-auto">
//       <div className="pb-10">
//         {/* Go Back Link */}
//         <div className="py-4">
//           <Link
//             to="/"
//             className="text-gray-800 font-semibold hover:underline hover:text-pink-600 transition-all"
//           >
//             Go Back
//           </Link>
//         </div>

//         {/* Product Section */}
//         <div className="flex flex-col">
//           <div className="py-8 bg-white md:py-16 antialiased border border-gray-300 rounded-md overflow-hidden">
//             <div className="max-w-screen-xl px-2 md:px-4 mx-auto 2xl:px-0">
//               <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
//                 <div className="shrink-0 max-w-md lg:max-w-lg mx-auto bg-white overflow-hidden">
//                   <img
//                     className="w-full"
//                     src={product.image}
//                     alt={product.name}
//                   />
//                 </div>

//                 <div>
//                   <h5 className="text-sm text-pink-600 font-semibold font-inter">
//                     {product.isFeatured ? "Sale!" : "New!"}
//                   </h5>
//                   <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                     {product.name}
//                   </h1>
//                   <div className="flex items-center space-x-3 mb-4">
//                     <span className="text-2xl text-pink-600 font-semibold">
//                       ৳{discountedPrice?.toFixed(2)}
//                     </span>
//                     {product.discountPercentage > 0 && (
//                       <>
//                         <span className="text-sm text-gray-500 line-through">
//                           ৳{product.price}
//                         </span>
//                         <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-2 py-1 rounded">
//                           -{product.discountPercentage}% Off
//                         </span>
//                         <span className="text-sm text-green-600">
//                           You Save: ৳{discountAmount.toFixed(2)}
//                         </span>
//                       </>
//                     )}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <p>Brand: {product.brand}</p>
//                     <p>
//                       Stock:{" "}
//                       {product.countInStock > 0 ? "Available" : "Out of Stock"}
//                     </p>
//                     <p>
//                       Shipping:{" "}
//                       <span className="font-semibold">{shipping}</span>
//                     </p>
//                   </div>

//                   {/* Actions */}
//                   <div className="mt-6 flex items-center space-x-4">
//                     {/* <AddToCartButton
//                       product={product}
//                       qty={1}
//                       buttonText="Add to Cart"
//                       addedText="Added to Cart"
//                       isOrderNow={true} // This enables the "Order Now" button
                     
//                     /> */}

//                     <OrderNowButton
//                       product={product}
//                       qty={1}
//                       customStyles="my-custom-class"
//                     />

//                     <button
//                       className="text-gray-500 hover:text-red-500 transition-colors"
//                       title="Add to Wishlist"
//                     >
//                       <HeartIcon product={product} />
//                     </button>
//                   </div>

//                   {/* Review Rating and Count */}
//                   <div className="mt-6 flex items-center space-x-2">
//                     <Ratings value={product.rating} />
//                     <span className="text-gray-500 text-sm">
//                       ({product.numReviews}{" "}
//                       {product.numReviews === 1 ? "review" : "reviews"})
//                     </span>
//                   </div>

//                   {/* Description */}
//                   <div className="mt-6">
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       Description
//                     </h3>
//                     <p className="text-gray-600">
//                       {isExpanded
//                         ? product.description
//                         : `${product.description.substring(0, 150)}${
//                             product.description.length > 150 ? "..." : ""
//                           }`}
//                     </p>
//                     {product.description.length > 150 && (
//                       <button
//                         className="text-pink-600 text-sm hover:underline mt-2"
//                         onClick={() => setIsExpanded(!isExpanded)}
//                       >
//                         {isExpanded ? "See Less" : "Read More"}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="container mx-auto mt-8 py-4">
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3">
//                 <FaCheck />
//                 <label className="text-sm">
//                   পন্যটি কিনতে “অর্ডার করুন” বাটনে চাপুন
//                 </label>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <FaCheck />
//                 <label className="text-sm">
//                   পুরো বাংলাদেশে হোম ডেলিভিরি মাধ্যমে পণ্য পৌঁছানো হয়
//                 </label>
//               </div>
//               <div className="flex items-start space-x-3">
//                 <FaCheck />
//                 <label className="text-sm">১টাকাও এডভান্স নেওয়া হয় না</label>
//               </div>
//             </div>

//             <div className="flex justify-between items-center mt-10 p-4 bg-gray-100 rounded-lg shadow-md">
//               <div className="text-sm text-gray-600">
//                 <span className="font-bold">Guaranteed Delivery</span>
//                 <span className="mx-2">|</span>
//                 <span className="font-bold">No Advance</span>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <img
//                   src={product.image}
//                   alt="COD Delivery"
//                   className="h-12 w-12 rounded-lg"
//                 />
//                 <span className="text-xl text-red-600 font-bold font-bangla">
//                   ক্যাশ অন ডেলিভারী
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Review Section */}
//           <div className="w-full mt-8 bg-gray-100 border border-gray-300 rounded-md overflow-hidden">
//             <ProductTabs
//               loadingProductReview={loadingProductReview}
//               userInfo={userInfo}
//               submitHandler={submitHandler}
//               rating={rating}
//               setRating={setRating}
//               comment={comment}
//               setComment={setComment}
//               product={product}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;


import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

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
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-white font-semibold hover:underline ml-[10rem]"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
              />

              <HeartIcon product={product} />
            </div>

            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
                {product.description}
              </p>

              <p className="text-5xl my-4 font-extrabold">$ {product.price}</p>

              <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2 text-white" /> Brand:{" "}
                    {product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[20rem]">
                    <FaClock className="mr-2 text-white" /> Added:{" "}
                    {moment(product.createAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Reviews:{" "}
                    {product.numReviews}
                  </h1>
                </div>

                <div className="two">
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2 text-white" /> Ratings: {rating}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                    {product.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaBox className="mr-2 text-white" /> In Stock:{" "}
                    {product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between flex-wrap">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg text-black"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="btn-container">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
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
        </>
      )}
    </>
  );
};

export default ProductDetails;
