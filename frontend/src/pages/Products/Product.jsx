// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { addToCart } from "../../redux/features/cart/cartSlice";
import HeartIcon from "./HeartIcon";
import "react-toastify/dist/ReactToastify.css";
import AddToCartButton from "../../components/AddToCartButton";

const Product = ({ product }) => {
  const dispatch = useDispatch();



  // Function to truncate the name if more than 4 words
  const truncateName = (name) => {
    const words = name.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return name;
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow ">
      <Link className="" to={`/product/${product._id}`}>
        <img
          className="p-5"
          src={product.image}
          alt={product.name}
        />
      </Link>
      {/* Heart Icon */}
     <div className="px-5">
     <HeartIcon  product={product} />
     </div>
      <div className="px-5 pb-5">
        <div className="flex items-center gap-1">
          <Link to={`/product/${product._id}`}>
            <h5 className="text-xl font-semibold tracking-tight text-gray-900">
              {truncateName(product.name)}
            </h5>
          </Link>
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

export default Product;
