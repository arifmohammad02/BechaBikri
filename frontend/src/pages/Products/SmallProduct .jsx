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

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <Link to={`/product/${product._id}`}>
        <img
          className="p-5"
          src={product.image}
          alt={product.name}
        />
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
          <span className="text-xl font-bold text-gray-900">
            BDT {product.price}
          </span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
