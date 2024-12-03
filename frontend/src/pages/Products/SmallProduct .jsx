import { Link } from "react-router-dom";
import React, { useState } from "react";
import HeartIcon from "./HeartIcon";
import AddToCartButton from "../../components/AddToCartButton";

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
      <Link to={`/product/${product._id}`}>
        <div className="relative">
          <img className="p-5" src={product.image} alt={product.name} />
          
          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded">
              -{product.discountPercentage}% Off
            </span>
          )}
        </div>
      </Link>

      {/* Heart Icon */}
      <div className="px-5">
        <HeartIcon product={product} />
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center gap-1">
          <Link to={`/product/${product._id}`}>
            <h5 className="text-xl font-semibold tracking-tight text-gray-900">
              {truncateName(product.name)}
            </h5>
          </Link>

          {/* "See More" or "See Less" button */}
          {product.name.split(" ").length > 4 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 text-xs hover:underline"
            >
              {isExpanded ? "See Less" : "See More"}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Discounted Price and Original Price */}
          <div>
            <span className="text-xl font-bold text-gray-900">
              BDT {discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-sm text-gray-500 line-through ml-2">
                  BDT {product.price}
                </span>
                <br />
                <span className="text-sm text-green-600">
                  You Save: BDT {discountAmount.toFixed(2)}
                </span>
              </>
            )}
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
