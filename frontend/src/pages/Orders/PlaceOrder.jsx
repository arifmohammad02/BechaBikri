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
  const { cartItems, shippingAddress, paymentMethod } = cart;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();

  // Calculate subtotal considering variant prices
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.variantInfo?.variantPrice || item.price || 0;
    const discountPercent = item.discountPercentage || 0;
    const discount = (price * discountPercent) / 100;
    return acc + (price - discount) * item.qty;
  }, 0);

  const shippingCharge = Number(cart.shippingAddress?.shippingCharge) || 0;
  const totalPrice = (subtotal + shippingCharge).toFixed(2);

  // Check if manual payment
  const isManualPayment = ["bKash", "Nagad", "Rocket", "Bank"].includes(paymentMethod);

  const placeOrderHandler = async () => {
    if (!validateFields()) return;

    // Save shipping address
    onPlaceOrder();

    try {
      setIsLoading(true);

      // Prepare order items with variant info
      const orderItemsWithVariants = cartItems.map((item) => ({
        name: item.name,
        qty: Number(item.qty),
        image: item.image || (item.images && item.images[0]),
        price: item.variantInfo?.variantPrice || Number(item.price) || 0,
        product: item._id || item.product,
        discountPercentage: Number(item.discountPercentage || 0),
        weight: Number(item.weight || 0.5),
        shippingDetails: item.shippingDetails,
        // Include variant information
        variantInfo: item.variantInfo || {
          hasVariants: false,
          colorIndex: null,
          colorName: "",
          colorHex: "",
          sizeIndex: null,
          sizeName: "",
          variantPrice: null,
          sku: "",
        },
      }));

      if (isManualPayment) {
        // Save order data for payment page
        localStorage.setItem("pendingOrderData", JSON.stringify({
          orderItems: orderItemsWithVariants,
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          itemsPrice: subtotal.toFixed(2),
          shippingPrice: shippingCharge.toFixed(2),
          totalPrice: totalPrice,
        }));
        
        navigate(`/payment/checkout`);
      } else {
        // Direct order creation for COD
        const orderData = {
          orderItems: orderItemsWithVariants,
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          itemsPrice: subtotal.toFixed(2),
          shippingPrice: shippingCharge.toFixed(2),
          totalPrice: totalPrice,
        };

        const res = await createOrder(orderData).unwrap();
        
        toast.success("Order placed successfully! 📦");
        dispatch(clearCartItems());
        navigate(`/order/${res._id}`);
      }
      
    } catch (error) {
      toast.error(
        error?.data?.message || "Something went wrong while placing order.",
      );
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
        <div className="flex justify-between items-center text-sm font-mono text-gray-500 font-bold uppercase">
          <span>Items Subtotal</span>
          <span className="text-gray-900 font-black">
            ৳{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm font-mono text-gray-500 font-bold uppercase">
          <span>Shipping Fee</span>
          <span
            className={`${shippingCharge === 0 ? "text-green-600" : "text-blue-600"} font-black`}
          >
            {shippingCharge === 0 ? "FREE" : `৳${shippingCharge.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-mono font-black text-gray-900 uppercase tracking-tighter">
          Total Payable
        </span>
        <span className="text-2xl font-mono font-black text-blue-600">
          ৳{totalPrice}
        </span>
      </div>

      <motion.button
        whileHover={{ scale: !isLoading ? 1.02 : 1 }}
        whileTap={{ scale: !isLoading ? 0.98 : 1 }}
        onClick={placeOrderHandler}
        disabled={isLoading || cartItems.length === 0}
        className={`w-full py-5 rounded-2xl font-mono font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
          isLoading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-black shadow-lg shadow-blue-100"
        }`}
      >
        {isLoading 
          ? "Processing..." 
          : isManualPayment 
            ? "Proceed to Payment" 
            : "Confirm My Order"
        }
      </motion.button>

      <p className="text-center text-[9px] text-gray-400 mt-4 font-mono uppercase tracking-widest">
        {isManualPayment 
          ? "You will pay first, then order will be created" 
          : "By clicking, you agree to our terms and conditions"
        }
      </p>
    </div>
  );
};

export default PlaceOrder