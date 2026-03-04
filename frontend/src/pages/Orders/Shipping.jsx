/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
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
  return (
    Number(item._finalPrice) ||
    Number(item._effectivePrice) ||
    Number(item.finalPrice) ||
    Number(item.price) ||
    0
  );
};

const getItemBasePrice = (item) => {
  return Number(item.basePrice) || Number(item.price) || 0;
};

// ✅ হেল্পার: ফ্লাশ সেল চেক
const isFlashSaleActive = (item) => {
  return (
    item._flashSaleActive ||
    item.flashSaleActive ||
    (item.flashSale?.isActive &&
      new Date() >= new Date(item.flashSale.startTime) &&
      new Date() <= new Date(item.flashSale.endTime))
  );
};

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  // ✅ localStorage থেকে saved address লোড করুন
  const getSavedShippingAddress = () => {
    try {
      const saved = localStorage.getItem("shippingAddress");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error parsing shipping address:", e);
    }
    return null;
  };

  const savedAddress = getSavedShippingAddress();

  // ✅ Redux state অথবা localStorage থেকে initial value নিন
  const initialAddress = shippingAddress || savedAddress || {};

  const [name, setName] = useState(initialAddress.name || "");
  const [address, setAddress] = useState(initialAddress.address || "");
  const [city, setCity] = useState(initialAddress.city || "");
  const [postalCode, setPostalCode] = useState(initialAddress.postalCode || "");
  const [country, setCountry] = useState(initialAddress.country || "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialAddress.phoneNumber || "",
  );

  const [paymentMethod, setPaymentMethod] = useState(
    initialAddress.paymentMethod || "Cash on Delivery",
  );

  // ✅ ভ্যালিডেশন এরর স্টেট
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ✅ ORDER SUMMARY STATE - এটি যোগ করুন
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shippingCharge: 0,
    totalPrice: 0,
    totalSavings: 0,
  });

  const dispatch = useDispatch();

  // ✅ Clean old cart data that has calculatedCharges (one-time cleanup)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        let needsUpdate = false;
        
        parsed.cartItems = parsed.cartItems.map(item => {
          if (item.shippingDetails?.calculatedCharges) {
            needsUpdate = true;
            const { calculatedCharges: _, ...restShippingDetails } = item.shippingDetails;
            return { ...item, shippingDetails: restShippingDetails };
          }
          return item;
        });
        
        if (needsUpdate) {
          localStorage.setItem("cart", JSON.stringify(parsed));
          window.location.reload();
        }
      } catch (e) {
        console.error("Error cleaning cart:", e);
      }
    }
  }, []);

  // ✅ ভ্যালিডেশন ফাংশন
  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 3) {
          error = "Name must be at least 3 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces";
        }
        break;

      case "phoneNumber":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^01[3-9]\d{8}$/.test(value)) {
          error = "Enter valid Bangladeshi number (01XXXXXXXXX)";
        }
        break;

      case "address":
        if (!value.trim()) {
          error = "Full address is required";
        } else if (value.trim().length < 10) {
          error = "Address must be at least 10 characters";
        }
        break;

      case "city":
        if (!value) {
          error = "Please select a division";
        }
        break;

      case "postalCode":
        if (!value.trim()) {
          error = "Postal code is required";
        } else if (!/^\d{4}$/.test(value)) {
          error = "Enter valid 4-digit postal code";
        }
        break;

      case "country":
        if (!value.trim()) {
          error = "Country is required";
        }
        break;

      case "paymentMethod":
        if (!value) {
          error = "Please select a payment method";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // ✅ রিয়েল-টাইম ভ্যালিডেশন
  const handleChange = (field, value) => {
    switch (field) {
      case "name": {
        setName(value);
        break;
      }
      case "phoneNumber": {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
        setPhoneNumber(digitsOnly);
        break;
      }
      case "address": {
        setAddress(value);
        break;
      }
      case "city": {
        setCity(value);
        break;
      }
      case "postalCode": {
        const postalDigits = value.replace(/\D/g, "").slice(0, 4);
        setPostalCode(postalDigits);
        break;
      }
      case "country": {
        setCountry(value);
        break;
      }
      case "paymentMethod": {
        setPaymentMethod(value);
        dispatch(savePaymentMethod(value));
        break;
      }
      default: {
        break;
      }
    }

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // ✅ ফিল্ড ব্লার হলে টাচ মার্ক করুন এবং ভ্যালিডেট করুন
  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // ✅ সম্পূর্ণ ফর্ম ভ্যালিডেশন
  const validateAllFields = () => {
    const newErrors = {};
    const fields = {
      name,
      phoneNumber,
      address,
      city,
      postalCode,
      country,
      paymentMethod,
    };

    Object.keys(fields).forEach((field) => {
      const error = validateField(field, fields[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      phoneNumber: true,
      address: true,
      city: true,
      postalCode: true,
      country: true,
      paymentMethod: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  // ✅ localStorage এ persist করুন
  useEffect(() => {
    const addressData = {
      name,
      address,
      city,
      postalCode,
      country,
      phoneNumber,
      paymentMethod,
    };

    if (name || phoneNumber || address || city || postalCode || country) {
      localStorage.setItem("shippingAddress", JSON.stringify(addressData));
    }
  }, [name, address, city, postalCode, country, phoneNumber, paymentMethod]);

  // ✅ Redux state sync
  useEffect(() => {
    if (savedAddress && !shippingAddress) {
      dispatch(
        saveShippingAddress({
          ...savedAddress,
          shippingCharge: calculateShippingCharge(savedAddress.city),
        }),
      );
      dispatch(
        savePaymentMethod(savedAddress.paymentMethod || "Cash on Delivery"),
      );
    }
  }, []);

  const hasFlashSaleItems = cartItems.some((item) => isFlashSaleActive(item));

  const calculateTotals = () => {
    return cartItems.reduce((acc, item) => {
      const finalPrice = getItemFinalPrice(item);
      const qty = Number(item.qty) || 1;
      return acc + finalPrice * qty;
    }, 0);
  };

  // ✅ FIXED: Dynamic shipping calculation
  const calculateShippingCharge = (selectedCity) => {
    if (cartItems.length === 0) {
      console.log("❌ No cart items, returning 0");
      return 0;
    }

    console.log("========================================");
    console.log("🚚 SHIPPING CALCULATION STARTED");
    console.log("========================================");
    console.log("📍 Selected City:", selectedCity);
    
    const isInsideDhaka = selectedCity?.toLowerCase().includes("dhaka");
    console.log("🏙️ Is Inside Dhaka:", isInsideDhaka);
    
    const itemsPrice = calculateTotals();
    console.log("💰 Total Items Price:", itemsPrice);

    const freeThresholds = cartItems
      .filter(i => i.shippingDetails?.isFreeShippingActive)
      .map(i => Number(i.shippingDetails?.freeShippingThreshold))
      .filter(t => t > 0);

    console.log("🎁 Free Shipping Thresholds:", freeThresholds);

    const minFreeThreshold = freeThresholds.length > 0 ? Math.min(...freeThresholds) : Infinity;
    console.log("🎯 Min Free Threshold:", minFreeThreshold);
    
    if (itemsPrice >= minFreeThreshold) {
      console.log("✅ FREE SHIPPING APPLIED! Returning 0");
      return 0;
    }

    let charges = [];
    console.log("\n📦 Processing", cartItems.length, "items:\n");

    cartItems.forEach((item, index) => {
      const s = item.shippingDetails || {};
      const type = s.shippingType?.toLowerCase();
      const qty = Number(item.qty) || 1;
      const weight = Number(item.weight) || 0.5;

      console.log(`--- Item ${index + 1}: ${item.name} ---`);
      console.log("  📋 shippingType:", type);
      console.log("  🔢 qty:", qty);
      console.log("  ⚖️ weight:", weight);
      console.log("  💵 insideDhakaCharge:", s.insideDhakaCharge);
      console.log("  💵 outsideDhakaCharge:", s.outsideDhakaCharge);
      console.log("  💵 fixedShippingCharge:", s.fixedShippingCharge);

      const getBaseRate = () => {
        const rate = isInsideDhaka 
          ? (Number(s.insideDhakaCharge) || 80) 
          : (Number(s.outsideDhakaCharge) || 150);
        console.log("  📊 getBaseRate() =", rate, "(isInsideDhaka:", isInsideDhaka + ")");
        return rate;
      };

      let itemCharge = 0;

      switch(type) {
        case "free": {
          itemCharge = 0;
          console.log("  🆓 Type: FREE → Charge:", itemCharge);
          break;
        }
        
        case "fixed": {
          const fixedCharge = Number(s.fixedShippingCharge);
          console.log("  🔧 Type: FIXED, fixedCharge:", fixedCharge);
          if (fixedCharge > 0) {
            itemCharge = fixedCharge;
            console.log("  ✅ Using fixedShippingCharge:", itemCharge);
          } else {
            itemCharge = getBaseRate();
            console.log("  ⚠️ No fixed charge, using base rate:", itemCharge);
          }
          break;
        }
        
        case "inside-outside": {
          itemCharge = getBaseRate();
          console.log("  🌐 Type: INSIDE-OUTSIDE → Charge:", itemCharge);
          break;
        }
        
        case "weight-based":
        default: {
          const totalWeight = weight * qty;
          const baseRate = getBaseRate();
          
          if (totalWeight <= 1) {
            itemCharge = baseRate;
          } else {
            const extra = Math.ceil(totalWeight - 1);
            itemCharge = baseRate + (extra * 20);
          }
          
          console.log("  ⚖️ Type: WEIGHT-BASED");
          console.log("     totalWeight (weight × qty):", totalWeight);
          console.log("     baseRate:", baseRate);
          console.log("     final charge:", itemCharge);
          break;
        }
      }

      charges.push(itemCharge);
      console.log("  💰 Item final charge:", itemCharge);
      console.log("");
    });

    const maxCharge = Math.max(...charges, 0);
    console.log("========================================");
    console.log("📊 All item charges:", charges);
    console.log("🚀 FINAL SHIPPING CHARGE:", maxCharge);
    console.log("========================================\n");

    return maxCharge;
  };

  // ✅ KEY FIX: city বা cartItems change হলে orderSummary update করুন
  useEffect(() => {
    const subtotal = calculateTotals();
    const shipping = calculateShippingCharge(city);
    const savings = cartItems.reduce((acc, item) => {
      const basePrice = getItemBasePrice(item);
      const finalPrice = getItemFinalPrice(item);
      return acc + (basePrice - finalPrice) * (Number(item.qty) || 1);
    }, 0);
    
    setOrderSummary({
      subtotal,
      shippingCharge: shipping,
      totalPrice: subtotal + shipping,
      totalSavings: savings,
    });
    
    console.log("🔄 Order Summary Updated:", {
      subtotal,
      shippingCharge: shipping,
      totalPrice: subtotal + shipping,
      totalSavings: savings,
    });
  }, [city, cartItems]);

  const handlePaymentMethodChange = (newMethodId) => {
    setPaymentMethod(newMethodId);
    dispatch(savePaymentMethod(newMethodId));
    handleChange("paymentMethod", newMethodId);

    const pendingOrderData = localStorage.getItem("pendingOrderData");
    if (pendingOrderData) {
      const parsedOrder = JSON.parse(pendingOrderData);
      const updatedOrder = {
        ...parsedOrder,
        paymentMethod: newMethodId,
      };
      localStorage.setItem("pendingOrderData", JSON.stringify(updatedOrder));
    }
  };

  const handleShippingDetails = () => {
    if (!validateAllFields()) {
      toast.error("Please fill all required fields correctly!");
      return false;
    }

    const calculatedShippingCharge = calculateShippingCharge(city);

    const shippingData = {
      name,
      address,
      city,
      postalCode: postalCode.trim(),
      country: country.trim() || "Bangladesh",
      phoneNumber,
      shippingCharge: calculatedShippingCharge,
      paymentMethod,
    };

    dispatch(saveShippingAddress(shippingData));
    dispatch(savePaymentMethod(paymentMethod));
    localStorage.setItem("shippingAddress", JSON.stringify(shippingData));
    return true;
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
    {
      id: "Cash on Delivery",
      label: "Cash on Delivery",
      icon: <FaMoneyBillWave />,
      color: "bg-green-50 border-green-200 text-green-700",
    },
    {
      id: "bKash",
      label: "bKash",
      icon: <FaMoneyBillWaveAlt />,
      color: "bg-pink-50 border-pink-200 text-pink-700",
    },
    {
      id: "Nagad",
      label: "Nagad",
      icon: <FaMoneyBillWaveAlt />,
      color: "bg-orange-50 border-orange-200 text-orange-700",
    },
    {
      id: "Rocket",
      label: "Rocket",
      icon: <FaMoneyBillWaveAlt />,
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
    {
      id: "Bank",
      label: "Bank Transfer",
      icon: <FaUniversity />,
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
  ];

  const getInputStyle = (fieldName) => {
    const baseStyle =
      "w-full p-4 border rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-2 outline-none transition-all font-mono text-sm";
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseStyle} border-red-500 focus:ring-red-500 bg-red-50/30`;
    }
    return `${baseStyle} border-gray-200 focus:ring-blue-500`;
  };

  const labelStyle =
    "flex items-center gap-2 mb-2 font-mono font-black uppercase text-[11px] tracking-widest text-gray-500";

  return (
    <div className="bg-[#FDFDFD] min-h-screen">
      <div className="py-8 bg-[#F9F1E7]/30 mt-[100px] border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center gap-3 font-mono text-sm">
          <Link to="/" className="text-gray-400 hover:text-blue-600 font-bold">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            to="/cart"
            className="text-gray-400 hover:text-blue-600 font-bold"
          >
            Cart
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-black tracking-tighter uppercase">
            Checkout
          </span>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        {hasFlashSaleItems && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3"
          >
            <FaBolt className="text-2xl animate-pulse" />
            <div>
              <p className="font-bold">⚡ Flash Sale Active on Some Items!</p>
              <p className="text-sm text-white/80">
                You are saving ৳{orderSummary.totalSavings.toFixed(2)} total!
              </p>
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
                {/* Name Field */}
                <div>
                  <label className={labelStyle}>
                    <BsPersonVcard /> Full Name
                  </label>
                  <input
                    type="text"
                    className={getInputStyle("name")}
                    value={name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={(e) => handleBlur("name", e.target.value)}
                    placeholder="Receiver Name"
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-xs font-mono mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Field */}
                  <div>
                    <label className={labelStyle}>
                      <GiVibratingSmartphone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      className={getInputStyle("phoneNumber")}
                      value={phoneNumber}
                      onChange={(e) =>
                        handleChange("phoneNumber", e.target.value)
                      }
                      onBlur={(e) => handleBlur("phoneNumber", e.target.value)}
                      placeholder="01XXX-XXXXXX"
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <p className="text-red-500 text-xs font-mono mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* City/Division Field */}
                  <div>
                    <label className={labelStyle}>
                      <TfiLocationPin /> Division
                    </label>
                    <select
                      value={city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      onBlur={(e) => handleBlur("city", e.target.value)}
                      className={getInputStyle("city")}
                    >
                      <option value="">Choose Area</option>
                      {divisions.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                    {errors.city && touched.city && (
                      <p className="text-red-500 text-xs font-mono mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Field */}
                <div>
                  <label className={labelStyle}>
                    <TfiLocationPin /> Full Address
                  </label>
                  <input
                    type="text"
                    className={getInputStyle("address")}
                    value={address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    onBlur={(e) => handleBlur("address", e.target.value)}
                    placeholder="House/Road/Area/Police Station"
                  />
                  {errors.address && touched.address && (
                    <p className="text-red-500 text-xs font-mono mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Postal Code Field */}
                  <div>
                    <label className={labelStyle}>
                      <MdOutlineLocalPostOffice /> Zip Code
                    </label>
                    <input
                      type="text"
                      className={getInputStyle("postalCode")}
                      value={postalCode}
                      onChange={(e) =>
                        handleChange("postalCode", e.target.value)
                      }
                      onBlur={(e) => handleBlur("postalCode", e.target.value)}
                      placeholder="1200"
                    />
                    {errors.postalCode && touched.postalCode && (
                      <p className="text-red-500 text-xs font-mono mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.postalCode}
                      </p>
                    )}
                  </div>

                  {/* Country Field */}
                  <div>
                    <label className={labelStyle}>
                      <FaGlobe /> Country
                    </label>
                    <input
                      type="text"
                      className={getInputStyle("country")}
                      value={country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      onBlur={(e) => handleBlur("country", e.target.value)}
                      placeholder="Country"
                    />
                    {errors.country && touched.country && (
                      <p className="text-red-500 text-xs font-mono mt-1 flex items-center gap-1">
                        <span>⚠</span> {errors.country}
                      </p>
                    )}
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

              {errors.paymentMethod && touched.paymentMethod && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm font-mono">
                  <span>⚠</span> {errors.paymentMethod}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePaymentMethodChange(method.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                      paymentMethod === method.id
                        ? `${method.color} border-current ring-2 ring-offset-2 ring-blue-100`
                        : errors.paymentMethod && touched.paymentMethod
                          ? "bg-red-50 border-red-300"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`text-2xl ${paymentMethod === method.id ? "scale-110" : "text-gray-400"}`}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-mono font-black text-sm uppercase tracking-tight ${
                          paymentMethod === method.id
                            ? "text-current"
                            : "text-gray-600"
                        }`}
                      >
                        {method.label}
                      </p>
                      {method.id === "Cash on Delivery" && (
                        <p className="text-[10px] text-gray-400 font-mono mt-1">
                          Pay when you receive
                        </p>
                      )}
                      {method.id !== "Cash on Delivery" && (
                        <p className="text-[10px] text-gray-400 font-mono mt-1">
                          Pay now via {method.label}
                        </p>
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
                    <p className="text-xs font-mono font-black uppercase text-gray-500 mb-1">
                      Selected Method
                    </p>
                    <p className="font-mono font-bold text-gray-900">
                      {
                        paymentMethods.find((m) => m.id === paymentMethod)
                          ?.label
                      }
                    </p>
                    {paymentMethod === "Cash on Delivery" ? (
                      <p className="text-[11px] text-gray-500 font-mono mt-1">
                        You will pay ৳{orderSummary.totalPrice.toFixed(2)} when the product
                        is delivered.
                        {orderSummary.totalSavings > 0 && (
                          <span className="text-green-600 block mt-1">
                            💰 You saved ৳{orderSummary.totalSavings.toFixed(2)}!
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-500 font-mono mt-1">
                        You will be redirected to payment instructions after
                        placing the order.
                        {orderSummary.totalSavings > 0 && (
                          <span className="text-green-600 block mt-1">
                            💰 Pay ৳{orderSummary.totalPrice.toFixed(2)} (Saved ৳
                            {orderSummary.totalSavings.toFixed(2)}!)
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
              {/* ✅ KEY FIX: orderSummary pass করুন */}
              <PlaceOrder
                orderSummary={orderSummary}
                onPlaceOrder={handleShippingDetails}
                validateFields={() => {
                  const isValid = validateAllFields();
                  if (!isValid) {
                    toast.error("Please fill all required fields correctly!");
                  }
                  return isValid;
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