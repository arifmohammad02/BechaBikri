import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import { useCreateOrderMutation } from "@redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

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
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
                <tr className="bg-gray-100">
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
                    className="hover:bg-gray-100 transition-all duration-300"
                  >
                    <td className="p-2 border-b border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>

                    <td className="p-2 border-b border-gray-200 max-w-xs truncate">
                      <Link className="text-blue-500 hover:underline">
                        {item.name}
                      </Link>
                    </td>

                    <td className="p-2 border-b border-gray-200">{item.qty}</td>

                    <td className="p-2 border-b border-gray-200">
                      BDT-{item.price.toFixed(2)}
                    </td>

                    <td className="p-2 border-b border-gray-200">
                      BDT-{(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-5">
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
              <div className="p-6 bg-white rounded-md border border-gray-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-600 pb-2">
                  Shipping
                </h2>
                <p className="text-gray-700 mb-2">
                  <strong className="text-indigo-600">Address:</strong>{" "}
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-pink-500">Email:</strong>{" "}
                  {cart.shippingAddress.email}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-pink-500">Phone Number:</strong>{" "}
                  {cart.shippingAddress.phoneNumber}
                </p>
                <p className="text-gray-700">
                  <strong className="text-pink-500">Emergency Contact:</strong>{" "}
                  {cart.shippingAddress.alternatePhoneNumber}
                </p>
              </div>

              {/* Payment Method */}
              <div className="p-6 bg-white rounded-md border border-gray-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-indigo-600 pb-2">
                  Payment Method
                </h2>
                <p className="text-gray-700">
                  <strong className="text-indigo-600">Method:</strong>{" "}
                  {cart.paymentMethod}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto w-full md:w-1/2 rounded-md">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-1 md:py-2 px-2 md:px-4 text-left">Item</th>
                    <th className="py-1 md:py-2 px-2 md:px-4 text-left">Price</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="hover:bg-gray-100 border-b">
                    <td className="py-1 md:py-2 px-2 md:px-4">
                      <span className="font-semibold text-indigo-600">
                        Items:
                      </span>
                    </td>
                    <td className="py-1 md:py-2 px-2 md:px-4">BDT- {cart.itemsPrice}</td>
                  </tr>
                  <tr className="hover:bg-gray-100 border-b">
                    <td className="py-1 md:py-2 px-2 md:px-4">
                      <span className="font-semibold text-indigo-600">
                        Shipping:
                      </span>
                    </td>
                    <td className="py-1 md:py-2 px-2 md:px-4">BDT- {cart.shippingPrice}</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="py-1 md:py-2 px-2 md:px-4">
                      <span className="font-semibold text-indigo-600">
                        Tax:
                      </span>
                    </td>
                    <td className="py-1 md:py-2 px-2 md:px-4">BDT- {cart.taxPrice}</td>
                  </tr>
                  {/* Highlighted Total Row */}
                  <tr className="bg-yellow-200 hover:bg-yellow-300">
                    <td className="py-1 md:py-2 px-2 md:px-4 font-bold text-indigo-800">
                      <span className="font-extrabold">Total:</span>
                    </td>
                    <td className="py-1 md:py-2 px-2 md:px-4 font-bold text-indigo-800">
                      BDT- {cart.totalPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            className={`relative flex justify-center items-center mr-10 bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 px-10 rounded-lg text-lg mt-4 shadow-lg transition-transform duration-300  ${
              cart.cartItems.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 hover:shadow-xl"
            }`}
            disabled={cart.cartItems.length === 0 || isLoading}
            onClick={placeOrderHandler}
          >
            {/* Spinner for Loading State */}
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5  text-white absolute right-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
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
