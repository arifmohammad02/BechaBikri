/* eslint-disable react/prop-types */

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // For navigation

const AddToCartButton = ({
  product,
  qty = 1,
  buttonText = "Add to Cart",
  addedText = "Added to Cart",
  customStyles = "",
  isOrderNow = false, // New prop to distinguish "Order Now"
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation

  // Access cart items from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Check if the product is already in the cart
  const isProductInCart = cartItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    // Dispatch action to add product to cart
    dispatch(addToCart({ ...product, qty }));

    // Show a toast notification
    toast.success(`${product.name} added to cart!`);
  };

  const handleOrderNow = () => {
    // Add the product to the cart
    dispatch(addToCart({ ...product, qty }));
    // Navigate to the cart page
    navigate("/cart");
  };

  return (
    <div className="flex space-x-4">
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isProductInCart || product.countInStock === 0}
        className={`text-white ${
          isProductInCart ? "bg-green-500" : "bg-blue-700"
        } 
          hover:bg-blue-800 focus:ring-4 focus:outline-none 
          font-medium rounded-lg text-sm px-4 py-2.5
          ${customStyles}`}
      >
        {isProductInCart ? addedText : buttonText}
      </button>

      {/* Order Now Button */}
      {isOrderNow && (
        <button
          onClick={handleOrderNow}
          disabled={product.countInStock === 0}
          className={`text-white bg-red-600 hover:bg-red-700 focus:outline-none 
            font-medium rounded-md text-sm px-4 h-10  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800`}
        >
          Order Now
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
