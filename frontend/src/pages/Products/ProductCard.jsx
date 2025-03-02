import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaCartShopping } from "react-icons/fa6";
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg border hover:border-[#B88E2F] transition-all duration-300">
      <div className="p-2 sm:p-4">
        <section className="relative overflow-hidden rounded-lg">
          <div className="w-full">
            <Link to={`/product/${p._id}`}>
              <span className="absolute bottom-10 right-3 bg-purple-100 text-[#B88E2F] text-xs font-medium px-2 py-0.5 rounded-full">
                {p?.brand}
              </span>
              <img
                className="cursor-pointer w-full rounded-md object-cover xs:h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80"
                src={p.image}
                alt={p.name}
              />
            </Link>
          </div>
          <div className="py-3 text-xl flex items-center justify-center">
            <HeartIcon product={p} />
          </div>
        </section>

        <div>
          <div>
            <h5 className="text-xl font-semibold text-[#242424] mb-1 truncate">
              {isExpanded ? p?.name : `${p?.name.substring(0, 20)}`}
              <button
                className="text-[#B88E2F] text-xs ml-2"
                onClick={toggleName}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </h5>
            <p className="text-lg  font-medium font-poppins text-[#242424">
              {p?.price?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </p>
          </div>

          <section className="flex justify-between items-center">
            <Link
              to={`/product/${p._id}`}
              className="px-2  font-poppins font-medium py-2 inline-flex items-center xs:text-sm xs:py-2 xs:px-2 sm:px-4 sm:py-2 sm:text-base bg-[#B88E2F]  text-white bg-gradient-to-r outline-none"
            >
              Read More
              <AiOutlineArrowRight className="ml-2 w-4 h-4" />
            </Link>

            <button
              className="px-2 py-2 inline-flex items-center bg-[#FAF3EA] rounded-full hover:bg-gray-200"
              onClick={() => addToCartHandler(p, 1)}
            >
              <FaCartShopping size={25} className="text-[#B88E2F]" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
