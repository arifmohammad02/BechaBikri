import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import PlaceOrder from "./PlaceOrder";
import { BsPersonVcard, BsCreditCard } from "react-icons/bs";
import { GiVibratingSmartphone } from "react-icons/gi";
import { TfiLocationPin } from "react-icons/tfi";
import { MdOutlineLocalPostOffice, MdOutlinePayments } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaGlobe, FaMoneyBillWave, FaBolt } from "react-icons/fa6";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaMoneyBillWaveAlt, FaUniversity } from "react-icons/fa";

// ✅ হেল্পার: আইটেমের জন্য সঠিক ফাইনাল প্রাইস
const getItemFinalPrice = (item) => {
  return Number(item._finalPrice) || 
         Number(item._effectivePrice) || 
         Number(item.finalPrice) || 
         Number(item.price) || 0;
};

const getItemBasePrice = (item) => {
  return Number(item.basePrice) || Number(item.price) || 0;
};

// ✅ হেল্পার: ফ্লাশ সেল চেক
const isFlashSaleActive = (item) => {
  return item._flashSaleActive || 
         item.flashSaleActive || 
         (item.flashSale?.isActive && new Date() >= new Date(item.flashSale.startTime) && new Date() <= new Date(item.flashSale.endTime));
};

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  const [name, setName] = useState(shippingAddress?.name || "");
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || "",
  );
  const [country, setCountry] = useState(shippingAddress?.country || "Bangladesh");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || "",
  );
  
  const [paymentMethod, setPaymentMethod] = useState(
    shippingAddress?.paymentMethod || "Cash on Delivery"
  );

  const dispatch = useDispatch();

  // Check for flash sale items
  const hasFlashSaleItems = cartItems.some(item => isFlashSaleActive(item));

  // ✅ সঠিক সাবটোটাল ক্যালকুলেশন
  const calculateTotals = () => {
    return cartItems.reduce((acc, item) => {
      const finalPrice = getItemFinalPrice(item);
      const qty = Number(item.qty) || 1;
      return acc + finalPrice * qty;
    }, 0);
  };

  // ✅ সঠিক শিপিং চার্জ ক্যালকুলেশন
  const calculateShippingCharge = (selectedCity) => {
    if (cartItems.length === 0) return 0;

    let totalWeight = 0;
    let maxFixedShipping = 0;
    let baseShippingRate = 0;
    const isInsideDhaka = selectedCity?.toLowerCase().includes("dhaka");

    // ✅ সঠিক আইটেমস প্রাইস (ফ্লাশ সেল প্রাইস সহ)
    const itemsPrice = calculateTotals();

    const activeThresholds = cartItems
      .filter((i) => i.shippingDetails?.isFreeShippingActive === true)
      .map((i) => Number(i.shippingDetails?.freeShippingThreshold))
      .filter((t) => !isNaN(t) && t > 0);

    const freeThreshold = activeThresholds.length > 0 ? Math.min(...activeThresholds) : Infinity;

    // ✅ ফ্রি শিপিং চেক
    if (itemsPrice >= freeThreshold) return 0;

    cartItems.forEach((item) => {
      const s = item.shippingDetails || {};
      const type = s.shippingType?.toLowerCase();

      if (type === "fixed") {
        maxFixedShipping = Math.max(maxFixedShipping, Number(s.fixedShippingCharge) || 0);
      } else if (type === "weight-based") {
        totalWeight += (Number(item.weight) || 0.5) * (Number(item.qty) || 1);
        const rate = isInsideDhaka
          ? Number(s.insideDhakaCharge) || 80
          : Number(s.outsideDhakaCharge) || 150;
        baseShippingRate = Math.max(baseShippingRate, rate);
      }
    });

    let weightCharge = 0;
    if (totalWeight > 0) {
      weightCharge = baseShippingRate;
      if (totalWeight > 1) {
        weightCharge += Math.ceil(totalWeight - 1) * 20;
      }
    }

    return weightCharge + maxFixedShipping;
  };

  // ✅ নতুন: পেমেন্ট মেথড চেঞ্জ হ্যান্ডলার
  const handlePaymentMethodChange = (newMethodId) => {
    setPaymentMethod(newMethodId);
    dispatch(savePaymentMethod(newMethodId));
    
    // ✅ নতুন: localStorage এর pendingOrderData আপডেট করুন
    const pendingOrderData = localStorage.getItem("pendingOrderData");
    if (pendingOrderData) {
      const parsedOrder = JSON.parse(pendingOrderData);
      const updatedOrder = {
        ...parsedOrder,
        paymentMethod: newMethodId
      };
      localStorage.setItem("pendingOrderData", JSON.stringify(updatedOrder));
      console.log("Updated pendingOrderData paymentMethod:", newMethodId);
    }
  };

  const handleShippingDetails = () => {
    const charge = calculateShippingCharge(city);
    dispatch(
      saveShippingAddress({
        name,
        address,
        city,
        postalCode,
        country,
        phoneNumber,
        shippingCharge: charge,
      }),
    );
    dispatch(savePaymentMethod(paymentMethod));
  };

  const divisions = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  const paymentMethods = [
    { id: "Cash on Delivery", label: "Cash on Delivery", icon: <FaMoneyBillWave />, color: "bg-green-50 border-green-200 text-green-700" },
    { id: "bKash", label: "bKash", icon: <FaMoneyBillWaveAlt />, color: "bg-pink-50 border-pink-200 text-pink-700" },
    { id: "Nagad", label: "Nagad", icon: <FaMoneyBillWaveAlt />, color: "bg-orange-50 border-orange-200 text-orange-700" },
    { id: "Rocket", label: "Rocket", icon: <FaMoneyBillWaveAlt />, color: "bg-purple-50 border-purple-200 text-purple-700" },
    { id: "Bank", label: "Bank Transfer", icon: <FaUniversity />, color: "bg-blue-50 border-blue-200 text-blue-700" },
  ];

  const inputStyle =
    "w-full p-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm";
  const labelStyle =
    "flex items-center gap-2 mb-2 font-mono font-black uppercase text-[11px] tracking-widest text-gray-500";

  const subtotal = calculateTotals();
  const shippingCharge = calculateShippingCharge(city);
  const totalPrice = subtotal + shippingCharge;
  
  // ✅ সঠিক সেভিংস ক্যালকুলেশন
  const totalSavings = cartItems.reduce((acc, item) => {
    const basePrice = getItemBasePrice(item);
    const finalPrice = getItemFinalPrice(item);
    return acc + (basePrice - finalPrice) * (Number(item.qty) || 1);
  }, 0);

  return (
    <div className="bg-[#FDFDFD] min-h-screen">
      <div className="py-8 bg-[#F9F1E7]/30 mt-[100px] border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center gap-3 font-mono text-sm">
          <Link to="/" className="text-gray-400 hover:text-blue-600 font-bold">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link to="/cart" className="text-gray-400 hover:text-blue-600 font-bold">
            Cart
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-black tracking-tighter uppercase">
            Checkout
          </span>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        {/* Flash Sale Alert */}
        {hasFlashSaleItems && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3"
          >
            <FaBolt className="text-2xl animate-pulse" />
            <div>
              <p className="font-bold">⚡ Flash Sale Active on Some Items!</p>
              <p className="text-sm text-white/80">You are saving ৳{totalSavings.toFixed(2)} total!</p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col xl:flex-row gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full xl:w-7/12"
          >
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm mb-8">
              <h1 className="text-3xl font-mono font-black text-gray-900 tracking-tighter uppercase mb-10">
                Delivery <span className="text-blue-600">Details</span>
              </h1>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className={labelStyle}>
                    <BsPersonVcard /> Full Name
                  </label>
                  <input
                    type="text"
                    className={inputStyle}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Receiver Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>
                      <GiVibratingSmartphone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      className={inputStyle}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="01XXX-XXXXXX"
                      maxLength={11}
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>
                      <TfiLocationPin /> Division
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={inputStyle}
                    >
                      <option value="">Choose Area</option>
                      {divisions.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>
                    <TfiLocationPin /> Full Address
                  </label>
                  <input
                    type="text"
                    className={inputStyle}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Road/Area/Police Station"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>
                      <MdOutlineLocalPostOffice /> Zip Code
                    </label>
                    <input
                      type="text"
                      className={inputStyle}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1200"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>
                      <FaGlobe /> Country
                    </label>
                    <input
                      type="text"
                      className={inputStyle}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h2 className="text-2xl font-mono font-black text-gray-900 tracking-tighter uppercase mb-6 flex items-center gap-3">
                <MdOutlinePayments className="text-blue-600" />
                Payment <span className="text-blue-600">Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    // ✅ আপডেটেড: নতুন হ্যান্ডলার ব্যবহার করুন
                    onClick={() => handlePaymentMethodChange(method.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                      paymentMethod === method.id
                        ? `${method.color} border-current ring-2 ring-offset-2 ring-blue-100`
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`text-2xl ${paymentMethod === method.id ? 'scale-110' : 'text-gray-400'}`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-mono font-black text-sm uppercase tracking-tight ${
                        paymentMethod === method.id ? 'text-current' : 'text-gray-600'
                      }`}>
                        {method.label}
                      </p>
                      {method.id === "Cash on Delivery" && (
                        <p className="text-[10px] text-gray-400 font-mono mt-1">Pay when you receive</p>
                      )}
                      {method.id !== "Cash on Delivery" && (
                        <p className="text-[10px] text-gray-400 font-mono mt-1">Pay now via {method.label}</p>
                      )}
                    </div>
                    {paymentMethod === method.id && (
                      <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Selected Payment Info */}
              <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <BsCreditCard className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs font-mono font-black uppercase text-gray-500 mb-1">Selected Method</p>
                    <p className="font-mono font-bold text-gray-900">
                      {paymentMethods.find(m => m.id === paymentMethod)?.label}
                    </p>
                    {paymentMethod === "Cash on Delivery" ? (
                      <p className="text-[11px] text-gray-500 font-mono mt-1">
                        You will pay ৳{totalPrice.toFixed(2)} when the product is delivered.
                        {totalSavings > 0 && (
                          <span className="text-green-600 block mt-1">
                            💰 You saved ৳{totalSavings.toFixed(2)}!
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-500 font-mono mt-1">
                        You will be redirected to payment instructions after placing the order.
                        {totalSavings > 0 && (
                          <span className="text-green-600 block mt-1">
                            💰 Pay ৳{totalPrice.toFixed(2)} (Saved ৳{totalSavings.toFixed(2)}!)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="w-full xl:w-5/12">
            <div className="sticky top-[120px]">
              <PlaceOrder
                onPlaceOrder={handleShippingDetails}
                validateFields={() => {
                  if (!name || !phoneNumber || !address || !city) {
                    toast.error("Please provide all delivery information!");
                    return false;
                  }
                  if (!paymentMethod) {
                    toast.error("Please select a payment method!");
                    return false;
                  }
                  return true;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;