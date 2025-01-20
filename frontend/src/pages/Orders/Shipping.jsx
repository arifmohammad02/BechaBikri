import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import PlaceOrder from "./PlaceOrder";
import { BsPersonVcard } from "react-icons/bs";
import { GiVibratingSmartphone } from "react-icons/gi";
import { TfiLocationPin } from "react-icons/tfi";
import { MdPayment } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { AiOutlineShopping } from "react-icons/ai";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [name, setName] = useState(shippingAddress?.name || "");
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const dispatch = useDispatch();

  // Redux state থেকে লোকাল state আপডেট করুন
  useEffect(() => {
    setAddress(shippingAddress?.address || "");
    setCity(shippingAddress?.city || "");
    setPostalCode(shippingAddress?.postalCode || "");
    setCountry(shippingAddress?.country || "");
    setPhoneNumber(shippingAddress?.phoneNumber || "");
  }, [shippingAddress]);

  // Shipping Address অটো আপডেট করার জন্য ফাংশন
  const handleShippingDetails = () => {
    // Redux-এ Shipping Address আপডেট
    dispatch(
      saveShippingAddress({
        name,
        address,
        city,
        postalCode,
        country,
        phoneNumber,
      })
    );

    // Redux-এ Payment Method আপডেট
    dispatch(savePaymentMethod(paymentMethod));
  };

  // ইনপুট পরিবর্তন হলে Redux আপডেট হবে
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
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

  return (
    <div className="container mx-auto my-[100px] px-3 md:px-0">
      <div className="flex flex-col md:flex-row w-full gap-8 items-start">
        {/* Delivery Details Form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center border border-opacity-65 rounded-xl">
          <form className=" py-5 px-6 w-full">
            <div className="border-b border-opacity-65">
              <h1 className="text-[22px] font-bold font-mono uppercase text-black mb-3">
                DELIVERY DETAILS<span className="text-red-600">*</span>
              </h1>
            </div>
            <div className="mb-6 mt-2">
              <div className="flex items-center gap-1 mb-1">
                <BsPersonVcard />
                <label className="font-medium text-xl text-black font-mono">
                  Your Name
                </label>
              </div>
              <input
                type="text"
                className="w-full p-3 border border-opacity-65 rounded bg-[#F3F4F7] placeholder:text-[#000000] text-[16px] font-mono font-normal"
                placeholder="Name*"
                value={name}
                required
                onChange={handleInputChange(setName)}
              />
            </div>

            <div className="mb-6 mt-2">
              <div className="flex items-center gap-1 mb-1">
                <GiVibratingSmartphone />
                <label className="font-medium text-xl text-black font-mono">
                  Your Phone
                </label>
              </div>

              <input
                type="text"
                className="w-full p-3 border border-opacity-65 rounded bg-[#F3F4F7] placeholder:text-[#000000] text-[16px] font-mono font-normal"
                placeholder="Phone number*"
                value={phoneNumber}
                required
                onChange={handleInputChange(setPhoneNumber)}
              />
            </div>
            <div className="mb-6 mt-2">
              <div className="flex items-center gap-1 mb-1">
                <TfiLocationPin />
                <label className="font-medium text-xl text-black font-mono">
                  Address
                </label>
              </div>
              <input
                type="text"
                className="w-full p-3 border border-opacity-65 rounded bg-[#F3F4F7] placeholder:text-[#000000] text-[16px] font-mono font-normal"
                placeholder="Address*"
                value={address}
                required
                onChange={handleInputChange(setAddress)}
              />
            </div>
            <div className="mb-6 mt-2">
              <label className="text-[22px] font-bold font-mono uppercase text-black mb-1">
                DELIVERY AREA<span className="text-red-600">*</span>
              </label>
              <select
                value={city}
                onChange={handleInputChange(setCity)}
                required
                className="w-full p-3 border border-opacity-65 rounded bg-[#F3F4F7] placeholder:text-[#000000] text-[16px] font-mono font-normal"
              >
                <option value="">Select a Division</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6 mt-2">
              <div className="flex items-center gap-1 mb-1">
                <label className="font-medium text-xl text-black font-mono">
                  Zip Code
                </label>
              </div>
              <input
                type="text"
                className="w-full p-3 border border-opacity-65 rounded bg-[#F3F4F7] placeholder:text-[#000000] text-[16px] font-mono font-normal"
                placeholder="Postal code*"
                value={postalCode}
                required
                onChange={handleInputChange(setPostalCode)}
              />
            </div>
            <div className="mb-6 mt-2">
              <div className="flex items-center gap-1 mb-1">
                <label className="font-medium text-xl text-black font-mono">
                  Your country
                </label>
              </div>
              <input
                type="text"
                className="w-full p-3 border border-opacity-65 rounded bg-[#F3F4F7] placeholder:text-[#000000] text-[16px] font-mono font-normal"
                placeholder="Country*"
                value={country}
                required
                onChange={handleInputChange(setCountry)}
              />
            </div>
            <div className="mb-4 mt-2">
              <div className="flex items-center gap-1 mb-1">
                <MdPayment />
                <label className="font-medium text-xl text-black font-mono">
                  Payment
                </label>
              </div>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                }}
                className="w-full p-3 border rounded text-[#000000] text-[18px] font-mono semibold"
              >
                <option
                  className="text-[#000000] text-[20px] font-mono semibold"
                  value="Cash on Delivery"
                >
                  Cash on Delivery
                </option>
              </select>
            </div>
          </form>
          <div className="flex justify-between px-6 mb-6">
            <Link
              to="/cart"
              className="flex items-center gap-1 text-[#6079d6] text-[16px] font-normal font-serif"
            >
              <FaArrowLeftLong />
              <p>Return to cart</p>
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-1 text-[#6079d6] text-[16px] font-normal font-serif"
            >
              <AiOutlineShopping />
              <p> Continue Shopping</p>
            </Link>
          </div>
        </div>
        {/* Order Summary */}
        <div className="md:w-1/2 w-full">
          <PlaceOrder onPlaceOrder={handleShippingDetails} />
        </div>
      </div>
    </div>
  );
};

export default Shipping;
