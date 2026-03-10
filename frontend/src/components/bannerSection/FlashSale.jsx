import { Link } from "react-router-dom";
import { useGetFlashSaleProductsQuery } from "../../redux/api/productApiSlice";
import Product from "../../pages/Products/Product";
import Message from "../Message";
import {
  FaLongArrowAltRight,
  FaFire,
  FaBolt,
  FaClock,
  FaPercentage,
} from "react-icons/fa";


// 🎯 Product Skeleton Component
const ProductSkeleton = () => {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden border border-red-100 shadow-sm h-full flex flex-col">
      {/* Flash Sale Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
          <div className="w-10 h-2 bg-red-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Timer Badge */}
      <div className="absolute top-2 right-2 z-10">
        <div className="bg-gray-900 text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
          <FaClock className="text-gray-400" />
          <div className="w-12 h-2 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FaBolt className="text-red-200 text-4xl" />
        </div>

        {/* Big Discount Badge */}
        <div className="absolute bottom-2 left-2 w-14 h-6 bg-red-500 rounded-lg animate-pulse flex items-center justify-center">
          <FaPercentage className="text-red-300 text-xs" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 flex flex-col flex-grow space-y-2">
        {/* Brand */}
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />

        {/* Title */}
        <div className="w-full h-4 bg-gray-300 rounded animate-pulse" />
        <div className="w-2/3 h-4 bg-gray-300 rounded animate-pulse" />

        {/* Flash Progress Bar */}
        <div className="w-full h-2 bg-red-100 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-red-300 rounded-full animate-pulse"
            style={{ width: "60%" }}
          />
        </div>
        <div className="w-20 h-2 bg-red-100 rounded animate-pulse" />

        {/* Price Section - Flash Sale Style */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <div className="w-16 h-5 bg-red-500 rounded animate-pulse" />
          <div className="w-14 h-4 bg-gray-300 rounded line-through animate-pulse" />
          <div className="w-10 h-4 bg-red-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// 🎯 Countdown Timer Skeleton
const CountdownSkeleton = () => (
  <div className="flex items-center gap-2 mb-4">
    <div className="flex items-center gap-1">
      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
      <span className="text-gray-400 font-bold">:</span>
      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
      <span className="text-gray-400 font-bold">:</span>
      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
    </div>
    <div className="w-16 h-4 bg-red-100 rounded-full animate-pulse" />
  </div>
);

// 🎯 Section Header Skeleton
const HeaderSkeleton = () => (
  <div className="flex flex-col items-center mb-6">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-4 h-4 bg-red-200 rounded-full animate-pulse" />
      <div className="w-20 h-4 bg-red-200 rounded animate-pulse" />
      <div className="w-4 h-4 bg-red-200 rounded-full animate-pulse" />
    </div>

    <div className="w-40 h-7 bg-gray-300 rounded-lg mb-2 animate-pulse" />

    <div className="w-12 h-1 bg-red-200 rounded-full mb-4 animate-pulse" />

    <CountdownSkeleton />
  </div>
);

const ButtonSkeleton = () => (
  <div className="flex justify-center mt-10">
    <div className="w-52 h-12 bg-gray-300 rounded-lg animate-pulse border-2 border-gray-200" />
  </div>
);

const FlashSale = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useGetFlashSaleProductsQuery(10);

  // 🎯 Skeleton Loading State
  if (isLoading) {
    return (
      <section className="py-10 bg-gray-50" aria-busy="true" aria-live="polite">
        <div className="container mx-auto px-4">
          <HeaderSkeleton />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...Array(10)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
          <ButtonSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-10 bg-gray-50"
      style={{ fontFamily: '"Trebuchet MS", sans-serif' }}
      aria-labelledby="flash-sale-heading"
    >
      <div className="container mx-auto px-4">
        {/* SEO Header Section */}
        <header className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center gap-2 mb-2">
            <FaFire className="text-red-500 animate-pulse" aria-hidden="true" />
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider bg-red-100 px-3 py-1 rounded-full">
              Limited Time Offer
            </span>
            <FaFire className="text-red-500 animate-pulse" aria-hidden="true" />
          </div>

          {/* Main SEO Heading */}
          <h2
            id="flash-sale-heading"
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
          >
            Best Flash Sale Deals of the Day
          </h2>
          <p className="text-gray-600 text-sm mb-4 max-w-md">
            Grab our exclusive discounts on top-rated products before the clock
            runs out!
          </p>

          <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-4" />
        </header>

        {/* Products Grid */}
        {isError ? (
          <Message variant="danger">
            {isError?.data?.message ||
              "Something went wrong. Please try again later."}
          </Message>
        ) : (
          <article>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products?.slice(0, 10).map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>

            {/* CTA - Call to Action with SEO friendly title */}
            <div className="flex justify-center mt-8">
              <Link
                to="/shop?flashsale=true"
                title="View all flash sale discounted products"
                className="no-underline"
              >
                <button
                  style={{ fontFamily: '"Trebuchet MS", sans-serif' }}
                  className="flex items-center gap-2 px-6 py-2.5 border border-gray-900 rounded-full text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                  aria-label="View all best selling products"
                >
                  Shop All Deals
                  <FaLongArrowAltRight aria-hidden="true" />
                </button>
              </Link>
            </div>
          </article>
        )}
      </div>
    </section>
  );
};

export default FlashSale;
