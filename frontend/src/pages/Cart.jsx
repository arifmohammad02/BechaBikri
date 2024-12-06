import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaArrowRight } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { LuShoppingBag } from "react-icons/lu";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=/shipping");
    }
  };

  // Function to calculate the discounted price
  const calculateDiscountedPrice = (product) => {
    if (product.discountPercentage > 0) {
      return (
        product.price -
        (product.price * product.discountPercentage) / 100
      ).toFixed(2);
    }
    return product.price.toFixed(2);
  };

  // Function to calculate the discount amount for each product
  const calculateDiscountAmount = (product) => {
    if (product.discountPercentage > 0) {
      return ((product.price * product.discountPercentage) / 100).toFixed(2);
    }
    return "0.00";
  };

  // Calculate total discount for all items in the cart
  const calculateTotalDiscount = () => {
    return cartItems
      .reduce((acc, item) => {
        if (item.discountPercentage > 0) {
          return (
            acc + (item.qty * (item.price * item.discountPercentage)) / 100
          );
        }
        return acc;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="pt-12">
      <div className="container flex justify-around items-start wrap mx-auto mt-8 pb-12">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <p>
              <LuShoppingBag className="w-28 h-28" />
            </p>
            <span className="text-[30px] font-medium font-sans text-center">
              Your cart is empty
            </span>
            <p className=" max-w-96 text-center">
              Add products while you shop, so they'll be ready for checkout
              later.
            </p>
            <button className="flex items-center gap-3 bg-blue-700 text-white py-3 px-5 rounded-md hover:bg-blue-600 transition-all ease-in-out duration-300">
              <Link to="/shop">Go To Shop</Link>
              <FaArrowRight />
            </button>
          </div>
        ) : (
          <>
            <div className="w-full mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-300 transition-shadow duration-300">
              <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                Shopping Cart
              </h1>

              {/* Cart Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white text-black rounded-lg border  border-gray-300 ">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="py-4 px-6 text-left">Product</th>
                      <th className="py-4 px-6 text-left">Price</th>
                      <th className="py-4 px-6 text-left">Quantity</th>
                      <th className="py-4 px-6 text-left">Discount</th>
                      <th className="py-4 px-6 text-left">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <td className="py-4 px-6 flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-[5rem] h-[5rem] object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                          <Link
                            to={`/product/${item._id}`}
                            className="hidden lg:block ml-4 text-pink-500 hover:text-pink-700 transition-colors duration-200 max-w-[500px]"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          BDT{" "}
                          {item.discountPercentage > 0
                            ? calculateDiscountedPrice(item)
                            : item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-3 border border-gray-200 text-center">
                          <div className="flex items-center justify-center space-x-4">
                            {/* Decrease Quantity Button */}
                            <button
                              className={`w-10 h-10 border rounded-full flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white ${
                                item.qty > 1
                                  ? "hover:shadow-md hover:scale-102 transition-transform"
                                  : "opacity-50 cursor-not-allowed"
                              }`}
                              onClick={() =>
                                item.qty > 1 &&
                                addToCartHandler(item, item.qty - 1)
                              }
                              disabled={item.qty === 1}
                            >
                              -
                            </button>

                            {/* Quantity Display */}
                            <span className="px-6 py-2 border rounded-full bg-gray-200 text-lg font-semibold shadow-md">
                              {item.qty}
                            </span>

                            {/* Increase Quantity Button */}
                            <button
                              className="w-10 h-10 border rounded-full flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white hover:shadow-lg hover:scale-105 transition-transform"
                              onClick={() =>
                                addToCartHandler(item, item.qty + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {item.discountPercentage > 0 ? (
                            <span className="text-green-500">
                              BDT {calculateDiscountAmount(item)}{" "}
                            </span>
                          ) : (
                            <span className="text-gray-500">No Discount</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            onClick={() => removeFromCartHandler(item._id)}
                          >
                            <FaTrash className="ml-2" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Section as Table */}
              <div className="flex flex-col pt-5 lg:pt-0 lg:flex-row items-center justify-between">
                <div className="w-full lg:max-w-[40rem]">
                  <p className="text-lg font-bold pb-2">Cash on delivery</p>
                  <p>
                    {" "}
                    সর্বোচ্চ ৪-৫ দিন (ঢাকায়) এবং ৫-৭ দিন (ঢাকার বাহিরে) সময়ের
                    মধ্যে হোম ডেলিভারী করা হয়।
                  </p>
                </div>
                <div className="mt-8 w-full lg:max-w-[45rem] p-4 border-2 border-gray-300 rounded-md">
                  <table className="min-w-full bg-white text-black rounded-md  border border-gray-200">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-sm md:text-lg text-left text-gray-700 font-semibold font-sans">
                          Total Items
                        </th>
                        <th className="py-3 px-4 text-sm md:text-lg text-left text-gray-700 font-semibold font-sans">
                          Total Price
                        </th>
                        <th className="py-3 px-4 text-sm md:text-lg text-left text-gray-700 font-semibold font-sans">
                          Total Discount
                        </th>
                        <th className="py-3 px-4 text-sm md:text-lg text-left text-gray-700 font-semibold font-sans">
                          Checkout
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-sm md:text-xl font-sans">
                          {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                        </td>
                        <td className="py-2 px-4 text-sm md:text-xl font-sans font-semibold text-gray-800">
                          BDT{" "}
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
                        </td>
                        <td className="py-2 px-4 text-sm md:text-xl font-sans font-semibold text-green-500">
                          BDT {calculateTotalDiscount()}
                        </td>
                        <td className="py-2">
                          <button
                            className="nline-flex items-center justify-center w-full px-3 py-2 mb-2 text-[14px] text-white bg-green-500 rounded-md hover:bg-green-400 sm:w-auto sm:mb-0" data-primary="green-400" data-rounded="rounded-2xl" data-primary-reset="{}"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                          >
                            Proceed To Checkout
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
