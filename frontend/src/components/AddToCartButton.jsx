/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import HeartIcon from "../pages/Products/HeartIcon";
import { FaLongArrowAltRight } from "react-icons/fa";

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

  const cartItems = useSelector((state) => state.cart.cartItems);
  const isAdded = cartItems.some((item) => item._id === product._id);

  // ডাইনামিক ইমেজ হ্যান্ডলিং (আপনার এরর সলভ করার জন্য এটি জরুরি)
  const mainImage = Array.isArray(product?.images) && product.images.length > 0 
    ? product.images[0] 
    : product?.image || "/placeholder.jpg";

  const handleAddToCart = () => {
    if (!isAdded) {
      // এখানে image: mainImage পাঠিয়ে আপনার Backend 500 এরর ফিক্স করা হয়েছে
      dispatch(addToCart({ ...product, qty, image: mainImage }));
      toast.success(`${product.name} added to cart!`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const handleOrderNow = () => {
    dispatch(addToCart({ ...product, qty, image: mainImage }));
    navigate("/shipping");
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        {/* Modern Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded || product.countInStock === 0}
          className={`group relative flex items-center justify-center gap-2 py-2 px-4 min-w-[160px] font-poppins font-bold text-[14px] uppercase tracking-wider rounded-xl border-2 transition-all duration-300 overflow-hidden
            ${isAdded 
              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" 
              : "border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white active:scale-95 shadow-sm hover:shadow-pink-200"
            } ${customStyles}`}
        >
          <CiShoppingCart className={`text-xl transition-transform duration-300 ${!isAdded && "group-hover:-translate-y-1"}`} />
          <span>{isAdded ? addedText : buttonText}</span>
        </button>

        {/* Heart Icon Wrapper */}
        <div className="">
          <HeartIcon product={product} />
        </div>
      </div>

      {/* Modern Order Now Button */}
      {isOrderNow && (
        <div className="mt-4">
          <button
            onClick={handleOrderNow}
            disabled={product.countInStock === 0}
            className="group relative flex items-center justify-center w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[16px] uppercase tracking-[2px] transition-all duration-500 hover:bg-pink-600 hover:shadow-[0_10px_30px_rgba(236,72,153,0.3)] active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Glossy Overlay effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <span className="relative flex items-center gap-2">
              Order Now
              <FaLongArrowAltRight className="text-xl group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </button>
          
          {/* Stock Indicator */}
          {product.countInStock <= 5 && product.countInStock > 0 && (
            <p className="text-center text-xs font-bold text-orange-500 mt-2 animate-pulse">
              Only {product.countInStock} items left in stock!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;