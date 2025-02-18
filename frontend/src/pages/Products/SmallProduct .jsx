import { Link } from "react-router-dom";
import React, { useState } from "react";
import HeartIcon from "./HeartIcon";
import { FaArrowRight } from "react-icons/fa6";
// import AddToCartButton from "../../components/AddToCartButton";

const SmallProduct = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to truncate the product name after 4 words
  const truncateName = (name) => {
    const words = name.split(" ");
    if (words.length > 3 && !isExpanded) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return name;
  };

  // Calculate discounted price and discount amount
  const discountedPrice =
    product.discountPercentage > 0
      ? product.price - (product.price * product.discountPercentage) / 100
      : product.price;

  const discountAmount =
    product.discountPercentage > 0
      ? (product.price * product.discountPercentage) / 100
      : 0;

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <Link to={`/product/${product._id}`}  >
        <div className="relative">
          <img className="p-5" src={product.image} alt={product.name} />

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-[#B88E2F] font-poppins text-white text-xs font-semibold px-2 py-1 rounded">
              -{product.discountPercentage}% Off
            </span>
          )}
        </div>
      </Link>

      {/* Heart Icon */}
      <div className="ml-4 pb-3 text-xl">
        <HeartIcon product={product} />
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center gap-1">
          <Link to={`/product/${product._id}`}>
            <h5 className="text-xl font-poppins font-semibold tracking-tight text-[#242424]">
              {truncateName(product.name)}
            </h5>
          </Link>

          {/* "See More" or "See Less" button */}
          {product.name.split(" ").length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#B88E2F] font-sans text-xs "
            >
              {isExpanded ? "See Less" : "See More"}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Discounted Price and Original Price */}
          <div className="flex items-center gap-1">
            <span className="text-lg font-poppins font-bold text-[#242424]">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <div className="flex flex-col items-start">
                <span className="text-sm font-poppins text-[#9F9F9F] line-through">
                  ₹{product.price}
                </span>

                {/* <span className="text-sm font-poppins text-[#B88E2F]">
                  save: ₹{discountAmount.toFixed(2)}
                </span> */}
              </div>
            )}
          </div>

          {/* <AddToCartButton product={product} /> */}
          <Link to={`/product/${product._id}`}>
            <div className="relative font-poppins inline-flex items-center justify-center w-full py-1 px-1 overflow-hidden font-medium text-[#B88E2F] transition duration-300 ease-out border-2 border-[#B88E2F] rounded-md shadow-md group">
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-[#B88E2F] group-hover:translate-x-0 ease">
                <FaArrowRight className="w-3 h-3 text-current" />
              </span>
              <span className="absolute flex items-center font-sans font-semibold justify-center w-full h-full text-[#B88E2F] transition-all duration-300 transform group-hover:translate-x-full ease text-xs">
                View Details
              </span>
              <span className="relative invisible">View Details</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
