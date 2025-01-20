import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import OrderSummery from "../../components/OrderSummery";

const PlaceOrder = ({ onPlaceOrder }) => {
  const cart = useSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();

  const placeOrderHandler = async () => {
    onPlaceOrder(); // শিপিং ডিটেইলস নিশ্চিত করা
    try {
      setIsLoading(true);
      const order = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${order._id}`);
    } catch (error) {
      toast.error("Order creation failed!");
    } finally {
      setIsLoading(false);
    }
  };


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

  return (
    <div className="border border-opacity-65 rounded-xl py-5 px-6">
      <h1 className="text-[22px] font-bold font-mono uppercase text-black text-center mb-3">
        Your Order Summery
      </h1>
      <div>
        <OrderSummery />
      </div>
      <div>
        <div className="py-4 text-[#000000] text-[16px] font-mono font-bold text-right flex justify-between">
          Subtotal:
          <span className="text-[#000000] text-[14px] md:text-[20px] font-mono font-bold">
            ₹
            {cartItems
              .reduce(
                (acc, item) =>
                  acc +
                  item.qty *
                    (item.discountPercentage > 0
                      ? calculateDiscountedPrice(item)
                      : item.price),
                0
              )
              .toFixed(2)}
          </span>
        </div>
      </div>
      <button
        onClick={placeOrderHandler}
        className={`px-4 py-2 text-white bg-green-500 rounded ${
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
