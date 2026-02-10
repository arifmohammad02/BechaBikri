/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import PlaceOrder from "./PlaceOrder";
import { BsPersonVcard, BsShieldCheck } from "react-icons/bs";
import { GiVibratingSmartphone } from "react-icons/gi";
import { TfiLocationPin } from "react-icons/tfi";
import { MdPayment, MdOutlineLocalPostOffice } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaArrowLeftLong, FaGlobe } from "react-icons/fa6";
import { AiOutlineShopping } from "react-icons/ai";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [name, setName] = useState(shippingAddress?.name || "");
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || "",
  );
  const [country, setCountry] = useState(
    shippingAddress?.country || "Bangladesh",
  );
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || "",
  );
  const [paymentMethod] = useState("Cash on Delivery");

  const dispatch = useDispatch();

  useEffect(() => {
    setName(shippingAddress?.name || "");
    setAddress(shippingAddress?.address || "");
    setCity(shippingAddress?.city || "");
    setPostalCode(shippingAddress?.postalCode || "");
    setCountry(shippingAddress?.country || "Bangladesh");
    setPhoneNumber(shippingAddress?.phoneNumber || "");
  }, [shippingAddress]);

  const getShippingCharge = (city) => (city === "Dhaka" ? 60 : 130);

  const handleShippingDetails = () => {
    const shippingCharge = getShippingCharge(city);
    dispatch(
      saveShippingAddress({
        name,
        address,
        city,
        postalCode,
        country,
        phoneNumber,
        shippingCharge,
      }),
    );
    dispatch(savePaymentMethod(paymentMethod));
  };

  useEffect(() => {
    handleShippingDetails();
  }, [address, city, postalCode, country, phoneNumber, paymentMethod]);

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

  const inputStyle =
    "w-full p-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 font-mono text-sm";
  const labelStyle =
    "flex items-center gap-2 mb-2 font-mono font-black uppercase text-[11px] tracking-widest text-gray-500";

  return (
    <div className="bg-[#FDFDFD] min-h-screen">
      {/* 🟢 ১. আধুনিক ব্রেডক্রাম্ব */}
      <div className="py-8 bg-[#F9F1E7]/30 mt-[100px] border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center gap-3 font-mono text-sm">
          <Link
            to="/"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            to="/cart"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            Cart
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-bold">Checkout</span>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col xl:flex-row gap-12">
          {/* 🟢 ২. ডেলিভারি ফর্ম (Left Side) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full xl:w-7/12"
          >
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-mono font-black text-gray-900 tracking-tighter uppercase">
                    Delivery <span className="text-blue-600">Details</span>
                  </h1>
                  <p className="text-gray-400 font-mono text-xs mt-1">
                    Please provide your correct shipping information.
                  </p>
                </div>
                <BsShieldCheck className="text-blue-600 text-3xl opacity-20" />
              </div>

              <form className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className={labelStyle}>
                    <BsPersonVcard /> Full Name
                  </label>
                  <input
                    type="text"
                    className={inputStyle}
                    placeholder="Enter your name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label className={labelStyle}>
                      <GiVibratingSmartphone /> Phone Number
                    </label>
                    <input
                      type="text"
                      className={inputStyle}
                      placeholder="017XXXXXXXX"
                      value={phoneNumber}
                      required
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  {/* Address */}
                  <div>
                    <label className={labelStyle}>
                      <TfiLocationPin /> Shipping Address
                    </label>
                    <input
                      type="text"
                      className={inputStyle}
                      placeholder="House, Road, Area..."
                      value={address}
                      required
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* Delivery Area Selection */}
                <div>
                  <label className={labelStyle}>
                    <TfiLocationPin /> Select Division
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Zip Code */}
                  <div>
                    <label className={labelStyle}>
                      <MdOutlineLocalPostOffice /> Zip Code
                    </label>
                    <input
                      type="text"
                      className={inputStyle}
                      placeholder="1200"
                      value={postalCode}
                      required
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                 
                  {/* Country */}
                  <div>
                    <label className={labelStyle}>
                      <FaGlobe /> Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      placeholder="Bangladesh"
                      required
                      className={`${inputStyle} bg-gray-100 cursor-not-allowed text-gray-400`}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                  <label className={`${labelStyle} text-blue-600`}>
                    <MdPayment /> Payment Method
                  </label>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-blue-200">
                    <input
                      type="radio"
                      checked
                      readOnly
                      className="w-5 h-5 accent-blue-600"
                    />
                    <div>
                      <p className="font-mono font-bold text-gray-900 text-sm">
                        Cash on Delivery
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        পণ্য হাতে পেয়ে টাকা দিন
                      </p>
                    </div>
                  </div>
                </div>
              </form>

              {/* Navigation Links */}
              <div className="mt-12 pt-8 border-t border-gray-50 flex flex-wrap justify-between gap-4">
                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-mono text-xs font-bold transition-all"
                >
                  <FaArrowLeftLong /> RETURN TO CART
                </Link>
                <Link
                  to="/shop"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-mono text-xs font-bold transition-all"
                >
                  <AiOutlineShopping className="text-lg" /> CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 🟢 ৩. অর্ডার সামারি (Right Side) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full xl:w-5/12"
          >
            <div className="sticky top-[120px]">
              <PlaceOrder
                onPlaceOrder={handleShippingDetails}
                validateFields={() => {
                  if (
                    !name ||
                    !phoneNumber ||
                    !address ||
                    !city ||
                    !postalCode
                  ) {
                    toast.error("Please fill all required fields! 🛠️");
                    return false;
                  }
                  return true;
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
