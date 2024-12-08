/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const OrderNowButton = ({ product, qty = 1, customStyles = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOrderNow = () => {
    if (!product || !product._id) {
      console.error("Invalid product data");
      return;
    }
    // Add product to cart and navigate to the cart page
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <button
      onClick={handleOrderNow}
      disabled={!product || product.countInStock === 0} // Disable if the product is out of stock
      className={`text-white bg-red-600 hover:bg-red-700 focus:outline-none 
        font-medium rounded-md text-sm px-4 h-10 dark:bg-red-600 
        dark:hover:bg-red-700 dark:focus:ring-red-800 ${customStyles}`}
    >
      Order Now
    </button>
  );
};

export default OrderNowButton;
