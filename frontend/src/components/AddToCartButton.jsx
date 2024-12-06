/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

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
    navigate("/cart");
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleAddToCart}
        disabled={isAdded || product.countInStock === 0}
        className={`text-white ${
          isAdded ? "bg-green-500" : "bg-blue-700"
        } hover:bg-blue-800 focus:ring-4 focus:outline-none 
          font-medium rounded-lg text-sm px-4 py-2.5 ${customStyles}`}
      >
        {isAdded ? addedText : buttonText}
      </button>

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
  );
};

export default AddToCartButton;
