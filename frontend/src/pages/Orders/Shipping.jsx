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
import { toast } from "react-toastify";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  // console.log(shippingAddress);
  // console.log(cart);

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
    setName(shippingAddress?.name || "");
    setAddress(shippingAddress?.address || "");
    setCity(shippingAddress?.city || "");
    setPostalCode(shippingAddress?.postalCode || "");
    setCountry(shippingAddress?.country || "");
    setPhoneNumber(shippingAddress?.phoneNumber || "");
  }, [shippingAddress]);

  const getShippingCharge = (city) => {
    return city === "Dhaka" ? 60 : 130;
  };

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
      })
    );

    // Redux-এ Payment Method আপডেট
    dispatch(savePaymentMethod(paymentMethod));
  };

  // ইনপুট পরিবর্তন হলে Redux আপডেট হবে

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
    <div>
      <div className="py-8 bg-[#E8E8E8] mt-[100px]">
        <div className="container mx-auto flex items-center gap-2 px-3 sm:px-0">
          <Link
            to="/"
            className="text-[#000000] font-medium font-serif text-[14px] md:text-[18px]"
          >
            Home
          </Link>
          <span className="text-[#000000] font-medium font-serif text-[14px] md:text-[18px]">
            /
          </span>
          <Link
            to="/cart"
            className="text-[#000000] font-medium font-serif text-[14px] md:text-[18px]"
          >
            Cart
          </Link>
          <span className="text-[#000000] font-medium font-serif text-[14px] md:text-[18px]">
            /
          </span>
          <span className="text-[#000000] font-medium font-serif text-[14px] md:text-[18px]">
            Checkout
          </span>
        </div>
      </div>
      <div className="container mx-auto my-[45px] px-3 md:px-0">
        <div className="flex flex-col xl:flex-row w-full gap-8 items-start">
          {/* Delivery Details Form */}
          <div className="w-full flex flex-col xl:w-1/2 justify-center border border-opacity-65 rounded-xl">
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
                  onChange={(e) => setName(e.target.value)} // ইনপুট পরিবর্তন হলে Redux আপডেট হবে}
                />
              </div>

              <div className="flex items-center gap-5">
                <div className="mb-6 mt-2 w-full">
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
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="mb-6 mt-2 w-full">
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
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-6 mt-2">
                <label className="text-[22px] font-bold font-mono uppercase text-black mb-1">
                  DELIVERY AREA<span className="text-red-600">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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

              <div className="flex items-center gap-5">
                <div className="mb-6 mt-2 w-full">
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
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div className="mb-6 mt-2 w-full">
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
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
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
          <div className="w-full xl:w-1/2 ">
            <PlaceOrder
              onPlaceOrder={handleShippingDetails}
              validateFields={() => {
                if (
                  !name ||
                  !phoneNumber ||
                  !address ||
                  !city ||
                  !postalCode ||
                  !country
                ) {
                  toast.error("All fields are required!");
                  return false;
                }
                return true;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
