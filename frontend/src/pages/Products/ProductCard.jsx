import { Link } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { useState } from "react";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully");
  };

  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle function to expand or collapse the text
  const toggleName = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg border hover:border-pink-500 transition-all duration-300">
      <div className="p-2 sm:p-4">
        <section className="relative overflow-hidden rounded-lg">
          <div className="w-full">
            <Link to={`/product/${p._id}`}>
              <span className="absolute bottom-3 right-3 bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {p?.brand}
              </span>
              <img
                className="cursor-pointer w-full rounded-md object-cover xs:h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"
                src={p.image}
                alt={p.name}
              />
            </Link>
          </div>
          <HeartIcon product={p} />
        </section>

        <div className="pt-4">
          <div>
            <h5 className="text-lg font-semibold text-gray-800 mb-2 truncate">
              {isExpanded ? p?.name : `${p?.name.substring(0, 20)}...`}
              <button
                className="text-blue-500 text-xs ml-2"
                onClick={toggleName}
              >
                {isExpanded ? "See Less" : "See More"}
              </button>
            </h5>
            <p className="text-xl font-bold text-gradient">
              {p?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "BDT",
              })}
            </p>
          </div>
          <p className="mb-3 text-sm text-gray-600 overflow-hidden">
            {p?.description?.substring(0, 32)} ...
          </p>
          <section className="flex justify-between items-center">
            <Link
              to={`/product/${p._id}`}
              className="px-2 py-2 inline-flex items-center xs:text-sm xs:py-2 xs:px-2 sm:px-4 sm:py-2 sm:text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:opacity-90 focus:outline-none"
            >
              Read More
              <AiOutlineArrowRight className="ml-2 w-4 h-4" />
            </Link>

            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              onClick={() => addToCartHandler(p, 1)}
            >
              <AiOutlineShoppingCart size={25} className="text-gray-600" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
