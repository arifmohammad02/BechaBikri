import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowRight,
  FaPlus,
  FaMinus,
  FaTag,
  FaTruckLoading,
  FaInfoCircle,
  FaCheck,
} from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { LuShoppingBag } from "react-icons/lu";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

// ✅ ADDED: Local helpers
const isFlashSaleActive = (item) => {
  if (!item?.flashSale || !item.flashSale.isActive) return false;
  const now = new Date();
  const startTime = new Date(item.flashSale.startTime);
  const endTime = new Date(item.flashSale.endTime);
  return now >= startTime && now <= endTime;
};

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  // ✅ ঢাকা চেক
  const city = shippingAddress?.city?.toLowerCase() || "";
  const isInsideDhaka = city.includes("dhaka");

  // ✅ weight-based আইটেম চেক
  const hasWeightBasedItems = cartItems.some((item) => {
    const s = item.shippingDetails || {};
    return s.shippingType === "weight-based";
  });

  // ✅ inside-outside আইটেম চেক
  const hasInsideOutsideItems = cartItems.some((item) => {
    const s = item.shippingDetails || {};
    return s.shippingType === "inside-outside";
  });

  // ✅ CHANGED: Complete cart item with all required fields
  const addToCartHandler = (product, qty) => {
    const cartItem = {
      ...product,
      qty,
      flashSale: product.flashSale,
      discountPercentage: product.discountPercentage,
      shippingDetails: product.shippingDetails,
      weight: product.weight,
      variantInfo: product.variantInfo,
    };
    dispatch(addToCart(cartItem));
  };

  const removeFromCartHandler = (item) => {
    dispatch(
      removeFromCart({
        _id: item._id,
        variantInfo: item.variantInfo || null,
      })
    );
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=/shipping");
    }
  };

  // ✅ সঠিক সাবটোটাল ক্যালকুলেশন
  const subtotal = cartItems.reduce((acc, item) => {
    const finalPrice =
      Number(item.finalPrice) ||
      Number(item._finalPrice) ||
      item.price ||
      0;
    return acc + finalPrice * item.qty;
  }, 0);

  // ✅ সঠিক সেভিংস ক্যালকুলেশন
  const totalSavings = cartItems.reduce((acc, item) => {
    const basePrice = Number(item.basePrice) || Number(item.price) || 0;
    const finalPrice =
      Number(item.finalPrice) ||
      Number(item._finalPrice) ||
      item.price ||
      0;
    const savingsPerItem = basePrice - finalPrice;
    return acc + savingsPerItem * item.qty;
  }, 0);

  // ✅ শুধু weight-based আইটেমের ওজন
  const totalWeight = cartItems.reduce((acc, item) => {
    const s = item.shippingDetails || {};
    if (s.shippingType === "weight-based") {
      return acc + (Number(item.weight) || 0.5) * item.qty;
    }
    return acc;
  }, 0);

  // ✅ আপডেটেড: নতুন শিপিং ক্যালকুলেশন (Utils/cart.js এর মতো)
  const calculateShipping = () => {
    let totalWeight = 0;
    let maxFixedShipping = 0;
    let hasWeightBased = false;
    let weightBasedCharge = 0;
    let maxInsideOutsideCharge = 0;

    // ফ্রি শিপিং থ্রেশহোল্ড
    const activeThresholds = cartItems
      .filter((i) => i.shippingDetails?.isFreeShippingActive === true)
      .map((i) => Number(i.shippingDetails?.freeShippingThreshold))
      .filter((t) => !isNaN(t) && t > 0);

    const freeThreshold =
      activeThresholds.length > 0 ? Math.min(...activeThresholds) : Infinity;

    // ফ্রি শিপিং চেক
    if (subtotal >= freeThreshold) {
      return 0;
    }

    cartItems.forEach((item) => {
      const s = item.shippingDetails || {};
      const type = s.shippingType?.toLowerCase();

      if (type === "fixed") {
        maxFixedShipping = Math.max(
          maxFixedShipping,
          Number(s.fixedShippingCharge) || 0
        );
      }
      // 👇 নতুন: inside-outside টাইপ
      else if (type === "inside-outside") {
        const charge = isInsideDhaka
          ? Number(s.insideDhakaCharge) || 80
          : Number(s.outsideDhakaCharge) || 150;
        maxInsideOutsideCharge = Math.max(maxInsideOutsideCharge, charge);
      }
      // 👇 weight-based টাইপ
      else if (type === "weight-based") {
        hasWeightBased = true;
        const weight = Number(item.weight) || 0.5;
        const qty = Number(item.qty) || 1;
        totalWeight += weight * qty;
      }
    });

    // ওজন অনুযায়ী চার্জ হিসাব
    if (hasWeightBased && totalWeight > 0) {
      const baseRate = isInsideDhaka ? 80 : 150;

      if (totalWeight <= 1) {
        weightBasedCharge = baseRate;
      } else {
        const extraWeight = Math.ceil(totalWeight - 1);
        weightBasedCharge = baseRate + extraWeight * 20;
      }
    }

    // 👇 সবচেয়ে বেশি চার্জ নেওয়া (ফিক্সড, ইনসাইড-আউটসাইড, ওয়েট-বেইজড এর মধ্যে)
    return Math.max(maxFixedShipping, maxInsideOutsideCharge, weightBasedCharge);
  };

  const shippingPrice = calculateShipping();

  // ফ্রি শিপিং প্রোগ্রেস বারের জন্য
  const activeThresholds = cartItems
    .filter((i) => i.shippingDetails?.isFreeShippingActive)
    .map((i) => Number(i.shippingDetails?.freeShippingThreshold))
    .filter((t) => t > 0);

  const freeThreshold =
    activeThresholds.length > 0 ? Math.min(...activeThresholds) : 0;

  const hasActiveFreeShipping = cartItems.some(
    (item) =>
      item.shippingDetails?.isFreeShippingActive ||
      item.shippingDetails?.shippingType === "free"
  );

  const progressPercent =
    freeThreshold > 0 ? Math.min((subtotal / freeThreshold) * 100, 100) : 0;
  const remainingForFree = freeThreshold - subtotal;
  const isFreeByThreshold = freeThreshold > 0 && subtotal >= freeThreshold;

  return (
    <div className="mt-[105px] bg-[#F9F9F9] min-h-screen pb-20">
      {/* Header */}
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
              Shopping Bag Empty
            </h2>
            <Link to="/shop">
              <button className="flex items-center gap-3 bg-black text-white py-4 px-10 rounded-xl font-mono font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all shadow-lg">
                Go to Shop <FaArrowRight />
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-10">
            <div className="flex-1 space-y-6">
              {/* Shipping Progress Bar */}
              {hasActiveFreeShipping && freeThreshold > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FaTruckLoading
                        className={isFreeByThreshold ? "text-green-600" : "text-red-600"}
                        size={20}
                      />
                      <p className="text-sm font-bold text-gray-800 font-mono uppercase tracking-tighter">
                        {isFreeByThreshold
                          ? "Congratulations! You've unlocked FREE SHIPPING"
                          : `Add ৳${Math.ceil(remainingForFree)} more for FREE SHIPPING`}
                      </p>
                    </div>
                    {/* ✅ শুধু weight-based আইটেমের ওজন দেখানো */}
                    {hasWeightBasedItems && (
                      <span className="text-[10px] font-mono font-black bg-gray-100 px-2 py-1 rounded">
                        Weight: {totalWeight.toFixed(2)} kg
                      </span>
                    )}
                  </div>

                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                      className={`h-full transition-all duration-1000 ${
                        isFreeByThreshold ? "bg-green-500" : "bg-red-600"
                      }`}
                    />
                  </div>

                  {!isFreeByThreshold && (
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                      Free shipping available on orders over ৳{freeThreshold}
                    </p>
                  )}
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => {
                  const finalPrice =
                    Number(item.finalPrice) ||
                    Number(item._finalPrice) ||
                    item.price ||
                    0;
                  const basePrice =
                    Number(item.basePrice) || Number(item.price) || 0;
                  const savingsPerItem = basePrice - finalPrice;
                  const hasFlashSale = isFlashSaleActive(item);
                  const discountPercent = hasFlashSale
                    ? item.flashSale?.discountPercentage || 0
                    : item.discountPercentage || 0;

                  const sDetails = item.shippingDetails || {};

                  // ✅ আইটেমের শিপিং টাইপ নির্ণয়
                  const itemPrice = finalPrice * item.qty;
                  const isItemFree =
                    sDetails.shippingType === "free" ||
                    (sDetails.isFreeShippingActive &&
                      itemPrice >= (sDetails.freeShippingThreshold || 0));
                  const itemShippingType = isItemFree
                    ? "free"
                    : sDetails.shippingType || "weight-based";

                  const variantText = item.variantInfo?.hasVariants
                    ? `${item.variantInfo.colorName} / ${item.variantInfo.sizeName}`
                    : "";

                  return (
                    <motion.div
                      key={`${item._id}-${item.variantInfo?.colorIndex}-${item.variantInfo?.sizeIndex}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-red-200 transition-all duration-300"
                    >
                      <div className="relative w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || (item.images && item.images[0])}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                        {discountPercent > 0 && (
                          <div
                            className={`absolute top-0 right-0 text-white text-[10px] font-black px-2 py-1 rounded-bl-lg ${
                              hasFlashSale ? "bg-purple-600" : "bg-red-600"
                            }`}
                          >
                            {hasFlashSale ? "⚡ FLASH" : ""}{" "}
                            {Math.round(discountPercent)}% OFF
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-mono font-black text-gray-900 uppercase group-hover:text-red-600 transition-colors">
                          {item.name}
                        </h3>

                        {item.variantInfo?.hasVariants && (
                          <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <span
                              className="w-3 h-3 rounded-full border border-gray-200"
                              style={{ backgroundColor: item.variantInfo.colorHex }}
                            />
                            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {variantText}
                            </span>
                            {item.variantInfo.sku && (
                              <span className="text-[9px] text-gray-400 font-mono">
                                SKU: {item.variantInfo.sku}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                          <span className="text-red-600 font-black font-mono">
                            ৳ {finalPrice.toLocaleString()}
                          </span>
                          {savingsPerItem > 0 && (
                            <span className="text-gray-400 text-xs line-through">
                              ৳{Number(basePrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {hasFlashSale && (
                          <div className="mt-1">
                            <span className="text-[9px] bg-purple-100 text-purple-600 px-2 py-1 rounded font-bold uppercase">
                              ⚡ Flash Sale Active
                            </span>
                          </div>
                        )}

                        {/* ✅ আপডেটেড: শিপিং টাইপ ব্যাজ */}
                        <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                          <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold uppercase">
                            {Number(item.weight) || 0.5}kg
                          </span>

                          {itemShippingType === "free" ? (
                            <span className="text-[9px] bg-green-100 text-green-600 px-2 py-1 rounded font-bold uppercase flex items-center gap-1">
                              <FaCheck size={8} /> Free Shipping
                            </span>
                          ) : itemShippingType === "fixed" ? (
                            <span className="text-[9px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold uppercase">
                              Fixed: ৳{sDetails.fixedShippingCharge || 0}
                            </span>
                          ) : itemShippingType === "inside-outside" ? (
                            <span className="text-[9px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded font-bold uppercase">
                              {isInsideDhaka ? "Inside" : "Outside"} Dhaka: ৳
                              {isInsideDhaka
                                ? sDetails.insideDhakaCharge || 80
                                : sDetails.outsideDhakaCharge || 150}
                            </span>
                          ) : (
                            <span className="text-[9px] bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold uppercase">
                              Weight-based: ৳
                              {isInsideDhaka
                                ? sDetails.insideDhakaCharge || 80
                                : sDetails.outsideDhakaCharge || 150}
                            </span>
                          )}
                        </div>
                      </div>

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

                      <div className="md:w-32 text-center md:text-right">
                        <p className="text-xl font-mono font-black text-gray-900 tracking-tighter">
                          ৳ {(item.qty * finalPrice).toFixed()}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCartHandler(item)}
                        className="p-2 text-gray-300 hover:text-red-600 hover:rotate-90 transition-all"
                      >
                        <IoMdClose size={24} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-red-600 font-mono text-[11px] font-black uppercase tracking-widest mt-4 transition-all"
              >
                <FaArrowLeftLong /> Return to Shop
              </Link>
            </div>

            {/* Summary Section */}
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
                      <span>Original Subtotal</span>
                      <span className="text-white">
                        ৳{(subtotal + totalSavings).toFixed()}
                      </span>
                    </div>

                    {totalSavings > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-between text-green-500 bg-green-500/10 p-3 rounded-xl border border-green-500/20"
                      >
                        <span className="flex items-center gap-2 font-black uppercase text-[10px]">
                          <FaTag /> Total Savings
                        </span>
                        <span className="font-black">- ৳{totalSavings.toFixed()}</span>
                      </motion.div>
                    )}

                    <div className="flex justify-between text-gray-500">
                      <span>Discounted Subtotal</span>
                      <span className="text-white font-bold">৳{subtotal.toFixed()}</span>
                    </div>

                    {/* ✅ শুধু weight-based আইটেমের ওজন */}
                    {hasWeightBasedItems && (
                      <div className="flex justify-between text-gray-500 border-t border-gray-800 pt-4">
                        <span>Total Weight (weight-based)</span>
                        <span className="text-white">{totalWeight.toFixed(2)} KG</span>
                      </div>
                    )}

                    {/* ✅ আপডেটেড: শিপিং ডিটেইলস */}
                    <div className="bg-gray-900/50 p-4 rounded-2xl space-y-2 border border-gray-800">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">Shipping:</span>
                        <span
                          className={
                            shippingPrice === 0
                              ? "text-green-500 font-black uppercase"
                              : "text-red-500 font-black uppercase"
                          }
                        >
                          {shippingPrice === 0 ? "Free" : `৳${shippingPrice}`}
                        </span>
                      </div>

                      {/* ✅ আপডেটেড: শিপিং ব্রেকডাউন */}
                      {shippingPrice > 0 && (
                        <div className="space-y-1 text-[9px] text-gray-400">
                          {/* Weight-based চার্জ */}
                          {hasWeightBasedItems && totalWeight > 0 && (
                            <p className="flex justify-between">
                              <span>Weight-based ({totalWeight.toFixed(2)}kg):</span>
                              <span>
                                ৳
                                {(() => {
                                  const baseRate = isInsideDhaka ? 80 : 150;
                                  let charge = baseRate;
                                  if (totalWeight > 1) {
                                    charge += Math.ceil(totalWeight - 1) * 20;
                                  }
                                  return charge;
                                })()}
                              </span>
                            </p>
                          )}

                          {/* Inside-outside চার্জ */}
                          {hasInsideOutsideItems && (
                            <p className="flex justify-between text-indigo-400">
                              <span>
                                {isInsideDhaka ? "Inside" : "Outside"} Dhaka delivery:
                              </span>
                              <span>
                                ৳
                                {Math.max(
                                  ...cartItems
                                    .filter(
                                      (i) => i.shippingDetails?.shippingType === "inside-outside"
                                    )
                                    .map((i) =>
                                      isInsideDhaka
                                        ? i.shippingDetails.insideDhakaCharge || 80
                                        : i.shippingDetails.outsideDhakaCharge || 150
                                    )
                                )}
                              </span>
                            </p>
                          )}

                          {/* Fixed চার্জ */}
                          {cartItems.some((i) => i.shippingDetails?.shippingType === "fixed") && (
                            <p className="flex justify-between text-blue-400">
                              <span>Fixed delivery (max):</span>
                              <span>
                                ৳
                                {Math.max(
                                  ...cartItems
                                    .filter((i) => i.shippingDetails?.shippingType === "fixed")
                                    .map((i) => i.shippingDetails.fixedShippingCharge || 0),
                                  0
                                )}
                              </span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* ✅ নোট: weight-based এর জন্য */}
                      {shippingPrice > 0 && hasWeightBasedItems && totalWeight > 1 && (
                        <p className="text-[9px] text-orange-400 italic leading-relaxed text-center mt-2">
                          * Extra ৳20/kg applies after 1kg for weight-based items
                        </p>
                      )}
                    </div>

                    <div className="h-px bg-gray-800 my-6" />

                    <div className="flex justify-between items-end">
                      <span className="text-xs text-gray-500 uppercase font-black">
                        Payable Amount
                      </span>
                      <span className="text-3xl font-black text-red-600 tracking-tighter">
                        ৳{(subtotal + shippingPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                    className="w-full group mt-10 flex items-center justify-center gap-3 bg-red-600 py-5 rounded-xl font-mono font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 shadow-xl"
                  >
                    Checkout <FaArrowRightLong className="group-hover:translate-x-2 transition-transform" />
                  </button>

                  <p className="mt-6 text-[9px] text-center text-gray-600 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                    <FaInfoCircle /> Verified Secure Checkout
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