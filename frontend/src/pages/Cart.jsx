import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowRight, FaPlus, FaMinus, FaTag } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { LuShoppingBag } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

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

  const calculateDiscountedPrice = (item) => {
    if (item.discountPercentage > 0) {
      return (
        item.price -
        (item.price * item.discountPercentage) / 100
      ).toFixed(2);
    }
    return item.price.toFixed(2);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * Number(calculateDiscountedPrice(item)),
    0,
  );

  const totalSavings = cartItems.reduce((acc, item) => {
    if (item.discountPercentage > 0) {
      const savingsPerItem = (item.price * item.discountPercentage) / 100;
      return acc + item.qty * savingsPerItem;
    }
    return acc;
  }, 0);

  return (
    <div className="mt-[105px] bg-[#F9F9F9] min-h-screen pb-20">
      {/* 🟢 ১. স্টাইলিশ হেডার (আপনার দেওয়া ডিজাইন অনুযায়ী) */}
      <div className="py-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold border-l-4 border-red-600 pl-4 text-gray-800 uppercase tracking-widest font-mono">
            Shopping <span className="text-red-600">Bag</span>
          </h1>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em] ml-5">
            <Link to="/" className="hover:text-red-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-black">Checkout Terminal</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-12 px-4">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-xl"
          >
            <LuShoppingBag className="w-20 h-20 text-gray-200 mb-6" />
            <h2 className="text-2xl font-mono font-black text-gray-800 uppercase tracking-tighter mb-6">
              Shopping Bag
            </h2>
            <Link to="/shop">
              <button className="flex items-center gap-3 bg-black text-white py-4 px-10 rounded-xl font-mono font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all shadow-lg">
                Go to Shop <FaArrowRight />
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-10">
            {/* 🟢 ২. আইটেম লিস্ট */}
            <div className="flex-1 space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-red-200 transition-all duration-300"
                  >
                    {/* ইমেজ ও ডিসকাউন্ট ব্যাজ */}
                    <div className="relative w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                      />
                      {item.discountPercentage > 0 && (
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-bl-lg animate-pulse">
                          {item.discountPercentage}% OFF
                        </div>
                      )}
                    </div>

                    {/* ইনফো */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg font-mono font-black text-gray-900 uppercase group-hover:text-red-600 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
                        <span className="text-red-600 font-black font-mono">
                          ৳
                          {Number(
                            calculateDiscountedPrice(item),
                          ).toLocaleString()}
                        </span>
                        {item.discountPercentage > 0 && (
                          <span className="text-gray-400 text-xs line-through">
                            ৳{item.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* কোয়ান্টিটি কন্ট্রোলার */}
                    <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
                      <button
                        onClick={() =>
                          item.qty > 1 && addToCartHandler(item, item.qty - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-red-600 transition-all shadow-sm"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="w-10 text-center font-mono font-black">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => addToCartHandler(item, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-red-600 transition-all shadow-sm"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    {/* আইটেম টোটাল */}
                    <div className="md:w-32 text-center md:text-right">
                      <p className="text-xl font-mono font-black text-gray-900 tracking-tighter">
                        ৳
                        {(
                          item.qty * Number(calculateDiscountedPrice(item))
                        ).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCartHandler(item._id)}
                      className="p-2 text-gray-300 hover:text-red-600 hover:rotate-90 transition-all"
                    >
                      <IoMdClose size={24} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-red-600 font-mono text-[11px] font-black uppercase tracking-widest mt-4 transition-all"
              >
                <FaArrowLeftLong /> Return to Shop
              </Link>
            </div>

            {/* 🟢 ৩. প্রিমিয়াম সামারি কার্ড */}
            <div className="xl:w-[400px]">
              <div className="sticky top-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black text-white rounded-[2rem] p-8 shadow-2xl border border-gray-800"
                >
                  <h3 className="text-xl font-bold mb-8 border-l-4 border-red-600 pl-3 uppercase tracking-wider font-mono">
                    Order Summary
                  </h3>

                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-white">
                        ৳{(subtotal + totalSavings).toLocaleString()}
                      </span>
                    </div>

                    {totalSavings > 0 && (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="flex justify-between text-green-500 bg-green-500/10 p-3 rounded-xl border border-green-500/20"
                      >
                        <span className="flex items-center gap-2 font-black uppercase text-[10px]">
                          <FaTag /> You Saved
                        </span>
                        <span className="font-black">
                          - ৳{totalSavings.toLocaleString()}
                        </span>
                      </motion.div>
                    )}

                    <div className="flex justify-between text-gray-500">
                      <span>Estimated Shipping</span>
                      <span className="text-[10px] italic">
                        Calculated Next)
                      </span>
                    </div>

                    <div className="h-px bg-gray-800 my-6" />

                    <div className="flex justify-between items-end">
                      <span className="text-xs text-gray-500 uppercase font-black">
                        Total Amount
                      </span>
                      <span className="text-3xl font-black text-red-600 tracking-tighter">
                        ৳{subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                    className="w-full group mt-10 flex items-center justify-center gap-3 bg-red-600 py-5 rounded-xl font-mono font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 shadow-xl"
                  >
                    Checkout{" "}
                    <FaArrowRightLong className="group-hover:translate-x-2 transition-transform" />
                  </button>

                  <p className="mt-6 text-[9px] text-center text-gray-600 uppercase tracking-widest font-bold">
                    Encrypted Gear Transaction
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
