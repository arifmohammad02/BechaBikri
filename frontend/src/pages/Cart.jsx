import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { LuShoppingBag } from "react-icons/lu";
// import Shipping from "./Orders/Shipping";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";

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



  return (
    <div className="mt-[72px]">
      <div className="py-8 bg-[#E8E8E8]">
        <div className="container mx-auto flex items-center gap-2 px-3 sm:px-0">
          <Link
            to="/"
            className="text-[#000000] font-medium font-poppins text-[14px] md:text-[18px]"
          >
            Home
          </Link>
          <span className="text-[#000000] font-medium font-poppins text-[14px] md:text-[18px]">
            /
          </span>
          <span className="text-[#9B9BB4] font-medium font-poppins text-[14px] md:text-[18px]">
            Shopping Cart
          </span>
        </div>
      </div>
      <div className="container flex justify-between items-center mx-auto mt-8 pb-12">
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
            <button className="flex items-center gap-3 bg-[#B88E2F] text-white py-3 px-5 rounded-md hover:bg-[#a1926d] transition-all ease-in-out duration-300">
              <Link to="/shop">Go To Shop</Link>
              <FaArrowRight />
            </button>
          </div>
        ) : (
          <div className="w-full px-3 sm:px-0">
            <div className="w-full">
              <h1 className="uppercase text-[22px] font-bold font-mono text-[#3C3836] pb-6 text-center md:text-left">
                Shopping Cart
              </h1>
              {/* Cart Table */}
              <div>
                <table className="w-full overflow-hidden">
                  <thead className="hidden md:table-header-group">
                    <tr className="border-b">
                      <th className="py-4 text-left font-bold text-[20px] font-mono uppercase text-[#3C3836]">
                        Product
                      </th>
                      <th className="py-4 px-6 text-center font-bold text-[20px] font-mono uppercase text-[#3C3836]">
                        Price
                      </th>
                      <th className="py-4 px-6 text-center font-bold text-[20px] font-mono uppercase text-[#3C3836]">
                        Quantity
                      </th>
                      <th className="py-4 px-6 text-center font-bold text-[20px] font-mono uppercase text-[#3C3836]">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-300 flex flex-col items-center md:table-row"
                      >
                        {/* Product Info */}
                        <td className="py-4 px-6 flex flex-col md:flex-row items-center border-b-[1px] md:border-b-0 w-full md:w-auto">
                          <button
                            className="text-black text-xl hover:text-red-700 transition-colors duration-200 mb-2 md:mb-0 md:mr-4"
                            onClick={() => removeFromCartHandler(item._id)}
                          >
                            <IoMdClose />
                          </button>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 mb-2 md:mb-0 md:mr-4"
                          />
                          <Link
                            to={`/product/${item._id}`}
                            className="text-[#000000] text-center text-[14px] md:text-[16px] font-mono font-medium"
                          >
                            {item.name}
                          </Link>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-6 text-[#000000] text-[14px] md:text-[16px] font-mono font-bold text-center border-b-[1px] md:border-b-0 w-full md:w-auto">
                          ₹{" "}
                          {item.discountPercentage > 0
                            ? calculateDiscountedPrice(item)
                            : item.price.toFixed(2)}
                        </td>

                        {/* Quantity */}
                        <td className="py-4 px-6 text-center border-b-[1px] md:border-b-0 w-full md:w-auto">
                          <div className="flex items-center justify-center space-x-2">
                            {/* Decrease Quantity Button */}
                            <button
                              className={`w-8 h-8 font-bold border rounded-full text-[#000000] text-[14px] md:text-[16px] font-mono ${
                                item.qty > 1
                                  ? "text-black border-gray-400"
                                  : "text-gray-400 border-gray-300 cursor-not-allowed"
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
                            <span className="w-10 h-10 inline-flex items-center justify-center border rounded-full bg-gray-100 text-[#000000] text-[14px] md:text-[16px] font-mono font-bold">
                              {item.qty}
                            </span>

                            {/* Increase Quantity Button */}
                            <button
                              className="w-8 h-8 font-bold border border-gray-400 rounded-full text-[#000000] text-[14px] md:text-[16px] font-mono hover:bg-gray-100"
                              onClick={() =>
                                addToCartHandler(item, item.qty + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-4 px-6 text-[#000000] text-[14px] md:text-[16px] font-mono font-bold text-center">
                          ₹{" "}
                          {(
                            item.qty *
                            (item.discountPercentage > 0
                              ? calculateDiscountedPrice(item)
                              : item.price)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Section as Table */}
              <div className="flex flex-col lg:flex-row  justify-between">
                <div className="w-full lg:max-w-[40rem]">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-[#000000] text-[14px] md:text-[18px] font-mono font-bold mt-5"
                  >
                    <FaArrowLeftLong className="text-[#000000] text-xs" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
                <div className="mt-8 w-full lg:max-w-[30rem] p-3 border-[1px] broder-opacity-50 rounded-md">
                  <div className="min-w-full text-black rounded-md  ">
                    <div>
                      {/* Subtotal */}
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

                      <h3 className="text-[#98928E] text-[16px] font-mono font-bold">
                        Shipping calculated at checkout
                      </h3>

                      {/* Checkout Button */}
                      <div className="py-2 px-4 bg-[#ED174A] text-center w-fit rounded-md mt-5">
                        <button
                          className={`flex items-center gap-1 text-[#ffffff] text-[14px] md:text-[16px] font-mono font-bold ${
                            cartItems.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={cartItems.length === 0}
                          onClick={checkoutHandler}
                        >
                          Go To Checkout{" "}
                          <span className="font-normal">
                            <FaLongArrowAltRight />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
