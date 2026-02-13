
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress, savePaymentMethod } from "../../redux/features/cart/cartSlice";
import PlaceOrder from "./PlaceOrder";
import { BsPersonVcard } from "react-icons/bs";
import { GiVibratingSmartphone } from "react-icons/gi";
import { TfiLocationPin } from "react-icons/tfi";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaGlobe } from "react-icons/fa6";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;

  const [name, setName] = useState(shippingAddress?.name || "");
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress?.phoneNumber || "");
  const [paymentMethod] = useState("Cash on Delivery");

  const dispatch = useDispatch();

  // --- 🚛 Backend Logic অনুযায়ী শিপিং চার্জ ক্যালকুলেশন ---
  const calculateShippingCharge = (selectedCity) => {
    if (cartItems.length === 0) return 0;

    let totalWeight = 0;
    let maxFixedShipping = 0; 
    let baseShippingRate = 0;
    const isInsideDhaka = selectedCity?.toLowerCase().includes("dhaka");

    // ১. সাবটোটাল ক্যালকুলেশন (ডিসকাউন্ট সহ)
    const itemsPrice = cartItems.reduce((acc, item) => {
      const discountPercent = item.discountPercentage || item.disdiscountPercentage || 0;
      const discount = (item.price * discountPercent) / 100;
      return acc + (item.price - discount) * item.qty;
    }, 0);

    // ২. ফ্রি শিপিং থ্রেশহোল্ড বের করা (শুধুমাত্র যাদের isFreeShippingActive: true)
    const activeThresholds = cartItems
      .filter(i => i.shippingDetails?.isFreeShippingActive)
      .map(i => Number(i.shippingDetails?.freeShippingThreshold) || 999999);

    const freeThreshold = activeThresholds.length > 0 ? Math.max(...activeThresholds) : 999999;

    // 🚩 শর্ত: যদি সাবটোটাল ফ্রি থ্রেশহোল্ডের সমান বা বেশি হয়, সব চার্জ ০
    if (activeThresholds.length > 0 && itemsPrice >= freeThreshold) return 0;

    // ৩. ওজন এবং ফিক্সড চার্জ নির্ধারণ (যদি ফ্রি না হয়)
    cartItems.forEach((item) => {
      const s = item.shippingDetails || {};
      
      if (s.shippingType === "fixed") {
        const currentFixed = Number(s.fixedShippingCharge) || 0;
        if (currentFixed > maxFixedShipping) maxFixedShipping = currentFixed;
      } else if (s.shippingType === "weight-based") {
        totalWeight += (Number(item.weight) || 0.5) * item.qty;
        const rate = isInsideDhaka 
          ? Number(s.insideDhakaCharge) || 80 
          : Number(s.outsideDhakaCharge) || 150;
        
        if (rate > baseShippingRate) baseShippingRate = rate;
      }
    });

    let dynamicShipping = 0;
    if (totalWeight > 0) {
      dynamicShipping = baseShippingRate;
      if (totalWeight > 1) {
        const extraWeight = Math.ceil(totalWeight - 1);
        dynamicShipping += extraWeight * 20;
      }
    }

    return dynamicShipping + maxFixedShipping;
  };

  const handleShippingDetails = () => {
    const charge = calculateShippingCharge(city);
    dispatch(
      saveShippingAddress({
        name, address, city, postalCode, country, phoneNumber,
        shippingCharge: charge,
      })
    );
    dispatch(savePaymentMethod(paymentMethod));
  };

  useEffect(() => {
    handleShippingDetails();
  }, [city, cartItems, name, address, phoneNumber]);

  const divisions = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"];
  const inputStyle = "w-full p-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm";
  const labelStyle = "flex items-center gap-2 mb-2 font-mono font-black uppercase text-[11px] tracking-widest text-gray-500";

  return (
    <div className="bg-[#FDFDFD] min-h-screen">
      <div className="py-8 bg-[#F9F1E7]/30 mt-[100px] border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center gap-3 font-mono text-sm">
          <Link to="/" className="text-gray-400 hover:text-blue-600 font-bold">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 font-black tracking-tighter uppercase">Checkout</span>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col xl:flex-row gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full xl:w-7/12">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h1 className="text-3xl font-mono font-black text-gray-900 tracking-tighter uppercase mb-10">
                Delivery <span className="text-blue-600">Details</span>
              </h1>

              <form className="space-y-6">
                <div>
                  <label className={labelStyle}><BsPersonVcard /> Full Name</label>
                  <input type="text" className={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Receiver Name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}><GiVibratingSmartphone /> Phone Number</label>
                    <input type="text" className={inputStyle} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="01XXX-XXXXXX" />
                  </div>
                  <div>
                    <label className={labelStyle}><TfiLocationPin /> Division</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)} className={inputStyle}>
                      <option value="">Choose Area</option>
                      {divisions.map((div) => <option key={div} value={div}>{div}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelStyle}><TfiLocationPin /> Full Address</label>
                  <input type="text" className={inputStyle} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House/Road/Area/Police Station" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}><MdOutlineLocalPostOffice /> Zip Code</label>
                    <input type="text" className={inputStyle} value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="1200" />
                  </div>
                  <div>
                    <label className={labelStyle}><FaGlobe /> Country</label>
                    <input type="text" className={inputStyle} value={country } onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
                  </div>
                </div>

                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between">
                    <div>
                     <p className="font-mono font-black text-gray-900 text-sm uppercase">Cash on Delivery</p>
                     <p className="text-[10px] text-gray-500 font-mono italic">Pay when you receive the product</p>
                    </div>
                    <div className="text-blue-600"><BsPersonVcard size={24}/></div>
                </div>
              </form>
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