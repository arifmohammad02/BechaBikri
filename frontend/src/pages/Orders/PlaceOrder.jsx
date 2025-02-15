import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateOrderMutation,
  usePayOrderMutation,
} from "@redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import OrderSummery from "../../components/OrderSummery";

const PlaceOrder = ({ onPlaceOrder, validateFields }) => {
  const cart = useSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const [payOrder] = usePayOrderMutation();
  const { cartItems } = cart;

  // console.log(cart);

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
    if (!validateFields()) {
      return;
    }
    onPlaceOrder(); // শিপিং ডিটেইলস নিশ্চিত করা
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

      await payOrder({
        orderId: order._id,
        details: { paymentMethod: "Cash On Delivery" },
      }).unwrap();
      // console.log(order._id);
      toast.success("Order placed successfully!");
      dispatch(clearCartItems());
      navigate(`/order/${order._id}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(cartItems);

  return (
    <div className="border border-opacity-65 rounded-xl py-5 px-6">
      <h1 className="text-[22px] font-bold font-mono uppercase text-black text-center mb-3">
        Your Order Summery
      </h1>
      <div>
        <OrderSummery />
      </div>
      <div className="border-b border-gray-300 mb-5">
        <div className="py-2 text-[#000000] text-[16px] font-mono font-semibold text-right flex justify-between ">
          Subtotal:
          <span className="text-[#000000] text-[14px] md:text-[18px] font-mono font-medium">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="py-2 text-[#000000] text-[16px] font-mono font-semibold text-right flex justify-between ">
          Shipping Fee
          <span>₹{shippingCharge.toFixed(2)}</span>
        </div>
      </div>
      <div>
        <div className="py-4 text-[#000000] text-[20px] font-mono font-bold text-right flex justify-between ">
          Total
          <span className="text-[#000000] text-[14px] md:text-[21px] font-mono font-bold">
            ₹{totalPrice}
          </span>
        </div>
      </div>
      <button
        onClick={placeOrderHandler}
        className={`px-4 py-4 w-full text-white text-[20px] font-normal font-serif bg-[#ED174A] hover:bg-[#223994] transition-all duration-300 ease-in-out rounded ${
          isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default PlaceOrder;
