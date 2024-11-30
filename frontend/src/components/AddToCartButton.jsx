/* eslint-disable react/prop-types */

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddToCartButton = ({
  product,
  qty = 1,
  buttonText = "Add to Cart",
  addedText = "Added to Cart",
  customStyles = "",
}) => {
  const dispatch = useDispatch();

  // Access cart items from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Check if the product is already in the cart
  const isProductInCart = cartItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    // Dispatch action to add product to cart
    dispatch(addToCart({ ...product, qty }));

    // Show a toast notification
    toast.success(`${product.name} added to cart!`, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isProductInCart || product.countInStock === 0}
      className={`text-white ${isProductInCart ? "bg-green-500" : "bg-blue-700"} 
        hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 
        font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 
        dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${customStyles}`}
    >
     
      {isProductInCart ? addedText : buttonText}
    </button>
  );
};

export default AddToCartButton;
