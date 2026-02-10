/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import OrderSummery from "../../components/OrderSummery";
import { motion } from "framer-motion";
import { HiOutlineShoppingBag } from "react-icons/hi";

const PlaceOrder = ({ onPlaceOrder, validateFields }) => {
  const cart = useSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const { cartItems } = cart;

  const calculateDiscountedPrice = (product) => {
    if (product.discountPercentage > 0) {
      return (
        product.price -
        (product.price * product.discountPercentage) / 100
      ).toFixed(2);
    }
    return product.price.toFixed(2);
  };

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      item.qty *
        (item.discountPercentage > 0
          ? calculateDiscountedPrice(item)
          : item.price),
    0
  );

  const shippingCharge = cart.shippingAddress?.shippingCharge || 0;
  const totalPrice = (subtotal + shippingCharge).toFixed(2);

  const placeOrderHandler = async () => {
    if (!validateFields()) return;
    
    onPlaceOrder();
    try {
      setIsLoading(true);
      const order = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shippingCharge,
        totalPrice: totalPrice,
      }).unwrap();

      toast.success("Order placed successfully! 🚀");
      dispatch(clearCartItems());
      navigate(`/order/${order._id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <HiOutlineShoppingBag size={24} />
        </div>
        <h1 className="text-xl font-mono font-black uppercase text-gray-900 tracking-tighter">
          Order <span className="text-blue-600">Summary</span>
        </h1>
      </div>

      <div className="mb-8 max-h-[300px] overflow-y-auto custom-scrollbar">
        <OrderSummery />
      </div>

      <div className="space-y-4 border-t border-b border-gray-50 py-6 mb-6">
        <div className="flex justify-between items-center text-sm font-mono text-gray-500 font-bold">
          <span>SUBTOTAL</span>
          <span className="text-gray-900 font-black">৳{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-mono text-gray-500 font-bold">
          <span>SHIPPING FEE</span>
          <span className="text-gray-900 font-black">৳{shippingCharge.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-mono font-black text-gray-900 uppercase">Total Amount</span>
        <div className="text-right">
          <span className="text-2xl font-mono font-black text-blue-600">
            ৳{totalPrice}
          </span>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mt-1 italic">
            VAT included (if applicable)
          </p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={placeOrderHandler}
        disabled={isLoading}
        className={`w-full py-5 rounded-2xl font-mono font-black text-lg uppercase tracking-widest shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 ${
          isLoading 
          ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
          : "bg-blue-600 text-white hover:bg-black"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          "Confirm Order"
        )}
      </motion.button>
      
      <p className="text-center text-[11px] text-gray-400 font-mono mt-4 uppercase tracking-tighter">
        By placing order, you agree to our <span className="underline cursor-pointer">Terms & Conditions</span>
      </p>
    </div>
  );
};

export default PlaceOrder;