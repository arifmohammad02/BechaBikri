import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import { useCreateOrderMutation } from "@redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { FaSpinner } from "react-icons/fa6";

const PlaceOrder = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  // console.log(cart);

  const calculateDiscountedPrice = (cartItems) => {
    return cartItems.reduce((total, item) => {
      const discountedPrice =
        item.price - (item.price * item.discountPercentage) / 100;
      return total + discountedPrice * item.qty;
    }, 0);
  };

  // Shipping Charge Calculation Function
  const calculateShippingCharge = (cartItems) => {
    return cartItems.reduce(
      (total, item) => total + item.shippingCharge * item.qty,
      0
    );
  };

  const discountedPrice = calculateDiscountedPrice(cart.cartItems);
  const shippingCharge = calculateShippingCharge(cart.cartItems);

  const finalTotal = discountedPrice + shippingCharge;

  const [createOrder, { error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      setIsLoading(true);
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        // itemsPrice: cart.itemsPrice,
        // shippingPrice: cart.shippingPrice,
        // taxPrice: cart.taxPrice,
        // totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(cart);

  return (
    <div className="container mx-auto py-12">
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border table-auto">
              <thead>
                <tr className="bg-[#F9F1E7] font-normal font-poppins text-[#242424]">
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Image
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left border-b border-gray-300">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#F9F1E7] transition-all duration-300"
                  >
                    <td className="p-2 border-b border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>

                    <td className="p-2 border-b border-gray-200 max-w-xs truncate">
                      <Link className="text-[#9F9F9F] font-poppins font-normal text-base">
                        {item.name}
                      </Link>
                    </td>

                    <td className="p-2 border-b text-[#9F9F9F] font-medium font-poppins px-5 border-gray-200">
                      {item.qty}
                    </td>

                    <td className="p-2 border-b text-[#9F9F9F] font-medium font-poppins px-5 border-gray-200">
                      ₹{item.price.toFixed(2)}
                    </td>

                    <td className="p-2 border-b text-[#B88E2F] font-medium font-poppins px-5 border-gray-200">
                      ₹{(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-3xl font-semibold font-poppins text-[#242424] mb-5">
            Order Summary
          </h2>
          <div className="flex flex-col md:flex-row justify-between gap-6  bg-white">
            <div className="w-full md:w-1/2 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 text-red-600 p-4 rounded-lg border border-red-300 shadow-lg animate-pulse">
                  <strong>Error:</strong> {error.data.message}
                </div>
              )}

              {/* Shipping Information */}
              <div className="p-6 bg-[#F9F1E7] rounded-md border border-gray-300">
                <h2 className="text-2xl font-poppins font-normal pb-3 text-[#242424] mb-4 border-b-2 border-[#B88E2F]">
                  Shipping
                </h2>
                <p className="text-[#9F9F9F] font-poppins font-normal mb-2 ">
                  <strong className="text-[#242424] font-medium font-poppins">
                    Address:
                  </strong>{" "}
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
                <p className="text-[#9F9F9F] font-poppins font-normal mb-2">
                  <strong className="text-[#242424] font-medium font-poppins">
                    Email:
                  </strong>{" "}
                  {cart.shippingAddress.email}
                </p>
                <p className="text-[#9F9F9F] font-poppins font-normal mb-2">
                  <strong className="text-[#242424] font-medium font-poppins">
                    Phone Number:
                  </strong>{" "}
                  {cart.shippingAddress.phoneNumber}
                </p>
                <p className="text-[#9F9F9F] font-poppins font-normal">
                  <strong className="text-[#242424] font-medium font-poppins">
                    Emergency Contact:
                  </strong>{" "}
                  {cart.shippingAddress.alternatePhoneNumber}
                </p>
              </div>

              {/* Payment Method */}
              <div className="p-6 bg-[#F9F1E7] rounded-md border border-gray-300">
                <h2 className="text-2xl font-poppins font-semibold text-[#242424] mb-4 border-b-2 border-[#B88E2F] pb-2">
                  Payment Method
                </h2>
                <p className="text-[#9F9F9F] font-poppins font-normal">
                  <strong className="text-[#B88E2F] font-semibold font-poppins">
                    Method:
                  </strong>{" "}
                  {cart.paymentMethod}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto w-full md:w-1/2 rounded-md">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <thead className="bg-[#F9F1E7] text-[#242424] font-poppins">
                  <tr>
                    <th className="py-1 md:py-2 px-2 md:px-4 text-left">
                      Item
                    </th>
                    <th className="py-1 md:py-2 px-2 md:px-4 text-left">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#242424]">
                  <tr className="hover:bg-[#F9F1E7] border-b">
                    <td className="py-1 md:py-2 px-2 md:px-4">
                      <span className="font-semibold text-[#242424] font-poppins">
                        Items
                      </span>
                    </td>
                    <td className="py-1 md:py-2 px-2 md:px-4 text-[#9F9F9F] font-poppins font-medium">
                      ₹{cart.itemsPrice}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F9F1E7] border-b">
                    <td className="py-1 md:py-2 px-2 md:px-4">
                      <span className="font-semibold text-[#242424] font-poppins">
                        Discounted Price
                      </span>
                    </td>
                    <td className="py-1 md:py-2 px-2 md:px-4 text-[#9F9F9F] font-poppins font-medium">
                      ₹{discountedPrice.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F9F1E7]">
                    <td className="py-1 md:py-2 px-2 md:px-4">
                      <span className="font-semibold text-[#242424] font-poppins">
                        Shipping Charge
                      </span>
                    </td>
                    <td className="py-1 md:py-2 px-2 md:px-4 text-[#9F9F9F] font-poppins font-medium">
                      ₹{shippingCharge.toFixed(2)}
                    </td>
                  </tr>
                  {/* Highlighted Total Row */}
                  <tr className="bg-[#B88E2F]">
                    <td className="py-1 md:py-2 px-2 md:px-4 font-bold text-[#242424] font-poppins">
                      <span className="font-extrabold">Total</span>
                    </td>
                    <td className="py-1 md:py-2 px-2 md:px-4 font-bold text-[#242424]">
                      ₹{finalTotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            className={`relative flex justify-center items-center mr-10  text-white bg-[#B88E2F] py-2 px-10 rounded-lg text-lg mt-4   ${
              cart.cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={cart.cartItems.length === 0 || isLoading}
            onClick={placeOrderHandler}
          >
            {/* Spinner for Loading State */}
            {isLoading && (
              <FaSpinner className="animate-spin h-5 w-5 text-white absolute right-2" />
            )}

            {/* Button Text */}
            <span className={`${isLoading ? "ml-2" : ""}`}>
              {isLoading ? "Placing Order..." : "Place Order"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
