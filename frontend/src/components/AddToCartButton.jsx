/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import HeartIcon from "../pages/Products/HeartIcon";

const AddToCartButton = ({
  product,
  qty = 1,
  buttonText = "Add to Cart",
  addedText = "Added to Cart",
  customStyles = "",
  isOrderNow = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access cart items from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);
  const isAdded = cartItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    if (!isAdded) {
      dispatch(addToCart({ ...product, qty }));
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleOrderNow = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/shipping");
  };

  return (
    <div>
      <div className="flex space-x-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdded || product.countInStock === 0}
          className={`text-blacktext-[13px] md:text-[16px] font-poppins font-medium border border-[#ED174A] border-opacity-20 flex items-center gap-1 py-[6px] px-2 text-black ${customStyles}`}
        >
          <CiShoppingCart className="text-[13px] md:text-[16px] text-[#ED174A]" />
          {isAdded ? addedText : buttonText}
        </button>
        <div className="flex items-center gap-2">
          <HeartIcon product={product}/>
        </div>
      </div>
      <div className="mt-2">
        {isOrderNow && (
          <button
            onClick={handleOrderNow}
            disabled={product.countInStock === 0}
            className="text-white bg-red-600 hover:bg-red-700 focus:outline-none 
            font-medium rounded-md text-sm px-4 h-10 dark:bg-red-600 
            dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Order Now
          </button>
        )}
      </div>
    </div>
  );
};

export default AddToCartButton;
