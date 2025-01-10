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

  const calculateTotalDiscount = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.warn("cartItems is either not an array or empty");
      return "0.00";
    }

    return cartItems
      .reduce((acc, item) => {
        if (
          item &&
          item.price > 0 &&
          item.qty > 0 &&
          item.discountPercentage > 0
        ) {
          const discount =
            (item.qty * (item.price * item.discountPercentage)) / 100;
          return acc + discount;
        }
        return acc; // Ignore invalid items
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
            <button className="flex items-center gap-3 bg-[#B88E2F] text-white py-3 px-5 rounded-md hover:bg-[#a1926d] transition-all ease-in-out duration-300">
              <Link to="/shop">Go To Shop</Link>
              <FaArrowRight />
            </button>
          </div>
        ) : (
          <>
            <div className="w-full mx-auto mt-8 bg-white p-6 rounded-lg  border border-gray-300 transition-shadow duration-300">
              <h1 className="text-xl font-medium mb-6 text-center text-[#242424]">
                Shopping Cart
              </h1>

              {/* Cart Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full  text-black rounded-lg border  border-gray-300 ">
                  <thead>
                    <tr className="border-b text-base font-poppins bg-[#F9F1E7] font-medium border-gray-300">
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
                        className="border-b border-gray-300  transition-colors duration-200"
                      >
                        <td className="py-4 px-6 flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-[5rem] h-[5rem] object-cover rounded-lg border border-gray-200 "
                          />
                          <Link
                            to={`/product/${item._id}`}
                            className="hidden lg:block ml-4 text-[#9F9F9F] text-base font-poppins font-normal  max-w-[500px]"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="py-4 text-[#9F9F9F] text-base font-poppins font-normal  px-6">
                          ₹{" "}
                          {item.discountPercentage > 0
                            ? calculateDiscountedPrice(item)
                            : item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-3 border border-gray-200 text-center">
                          <div className="flex items-center justify-center space-x-4">
                            {/* Decrease Quantity Button */}
                            <button
                              className={`w-8 h-8 font-medium inline-flex text-lg  border border-[#B88E2F] rounded-full  items-center justify-center text-black ${
                                item.qty > 1
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
                            <span className="w-12 h-12 inline-flex items-center justify-center border rounded-full bg-[#F9F1E7] text-lg font-normal font-poppins">
                              {item.qty}
                            </span>

                            {/* Increase Quantity Button */}
                            <button
                              className=" w-8 h-8 font-medium inline-flex text-lg  border border-[#B88E2F] rounded-full  items-center justify-center text-black "
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
                            <span className="text-[#242424] font-poppins font-normal text-base">
                              ₹{calculateDiscountAmount(item)}{" "}
                            </span>
                          ) : (
                            <span className="text-gray-500">No Discount</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            className="text-[#B88E2F] transition-colors duration-200"
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
                  <p className="text-lg text-[#242424]  font-normal font-poppins pb-2">
                    Cash on delivery
                  </p>
                  <p className="text-xl text-[#242424]  font-normal font-poppins">
                    {" "}
                    সর্বোচ্চ ৫ দিন সময়ের মধ্যে হোম ডেলিভারী করা হয়।
                  </p>
                </div>
                <div className="mt-8 w-full bg-[#F9F1E7] lg:max-w-[45rem] p-4 border-2 border-gray-300 rounded-md">
                  <table className="min-w-full bg-[#F9F1E7] text-black rounded-md  ">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-sm md:text-lg text-left text-[#242424] font-semibold font-sans">
                          Total Items
                        </th>
                        <th className="py-3 px-3 text-sm md:text-lg text-left text-[#242424] font-semibold font-sans">
                          Total Price
                        </th>
                        <th className="py-3 px-3 text-sm md:text-lg text-left text-[#242424] font-semibold font-sans">
                          Total Discount
                        </th>
                        <th className="py-3 px-1 text-sm md:text-lg text-left text-[#242424] font-semibold font-sans">
                          Checkout
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-5 text-sm md:text-xl font-sans">
                          {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                        </td>
                        <td className="py-2 lg:px-4 px-4 text-sm md:text-xl font-sans font-semibold  text-[#B88E2F]">
                          ₹{" "}
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
                        <td className="py-2 lg:px-4 px-4 text-sm md:text-xl font-sans font-semibold text-[#242424]">
                          ₹{calculateTotalDiscount()}
                        </td>
                        <td className="py-2">
                          <button
                            className="inline-flex items-center justify-center w-full lg:px-4 px-1 py-1 mb-2 text-[14px] rounded-md text-base font-sans font-semibold text-[#242424]  sm:w-auto  sm:mb-0 border border-[#242424]"
                            data-primary="green-400"
                            data-rounded="rounded-2xl"
                            data-primary-reset="{}"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                          >
                            Checkout
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>

          // <>
          //   <div className="flex flex-col w-[80%]">
          //     <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

          //     {cartItems.map((item) => (
          //       <div key={item._id} className="flex items-enter mb-[1rem] pb-2">
          //         <div className="w-[5rem] h-[5rem]">
          //           <img
          //             src={item.image}
          //             alt={item.name}
          //             className="w-full h-full object-cover rounded"
          //           />
          //         </div>

          //         <div className="flex-1 ml-4">
          //           <Link to={`/product/${item._id}`} className="text-pink-500">
          //             {item.name}
          //           </Link>

          //           <div className="mt-2 text-white">{item.brand}</div>
          //           <div className="mt-2 text-white font-bold">
          //             $ {item.price}
          //           </div>
          //         </div>

          //         <div className="w-24">
          //           <select
          //             className="w-full p-1 border rounded text-black"
          //             value={item.qty}
          //             onChange={(e) =>
          //               addToCartHandler(item, Number(e.target.value))
          //             }
          //           >
          //             {[...Array(item.countInStock).keys()].map((x) => (
          //               <option key={x + 1} value={x + 1}>
          //                 {x + 1}
          //               </option>
          //             ))}
          //           </select>
          //         </div>

          //         <div>
          //           <button
          //             className="text-red-500 mr-[5rem]"
          //             onClick={() => removeFromCartHandler(item._id)}
          //           >
          //             <FaTrash className="ml-[1rem] mt-[.5rem]" />
          //           </button>
          //         </div>
          //       </div>
          //     ))}

          //     <div className="mt-8 w-[40rem]">
          //       <div className="p-4 rounded-lg">
          //         <h2 className="text-xl font-semibold mb-2">
          //           Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
          //         </h2>

          //         <div className="text-2xl font-bold">
          //           ${" "}
          //           {cartItems
          //             .reduce((acc, item) => acc + item.qty * item.price, 0)
          //             .toFixed(2)}
          //         </div>

          //         <button
          //           className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
          //           disabled={cartItems.length === 0}
          //           onClick={checkoutHandler}
          //         >
          //           Proceed To Checkout
          //         </button>
          //       </div>
          //     </div>
          //   </div>
          // </>
        )}
      </div>
    </div>
  );
};

export default Cart;
