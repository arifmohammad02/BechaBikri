import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Imp
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

import { FaArrowRight } from "react-icons/fa";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress.phoneNumber || ""
  );
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState(
    shippingAddress.alternatePhoneNumber || ""
  );
  const [email, setEmail] = useState(shippingAddress.email || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    // Input validations

    toast.success("All inputs are valid! Proceeding...", {
      position: "bottom-right",
      theme: "colored",
    });

    // Dispatch actions
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
        phoneNumber,
        alternatePhoneNumber,
        email,
      })
    );
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto mt-20 px-3 md:px-0">
      <ProgressSteps step1 step2 />
      <div className="w-full flex justify-center py-5">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-7xl bg-[#F9F1E7] p-8 rounded-lg border"
        >
          <h1 className="text-3xl font-poppins font-normal mb-6 text-center text-[#242424]">
            Shipping
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side Inputs (Address, City, Postal Code, Country) */}
            <div>
              <div className="mb-6">
                <label className="block font-poppins font-normal text-[#242424] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md outline-none "
                  placeholder="Enter address"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#242424] font-normal font-poppins mb-2">
                  City
                </label>
                <input
                  type="text"
                  className="w-full p-3 border outline-none border-gray-300 rounded-md "
                  placeholder="Enter city"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#242424] font-normal font-poppins mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  className="w-full p-3 border outline-none border-gray-300 rounded-md"
                  placeholder="Enter postal code"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#242424] font-normal font-poppins mb-2">
                  Country
                </label>
                <input
                  type="text"
                  className=" w-full p-3 border outline-none border-gray-300 rounded-md"
                  placeholder="Enter country"
                  value={country}
                  required
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            {/* Right Side Inputs (Phone Number, Email, Select Method) */}
            <div>
              <div className="mb-6">
                <label className="block text-[#242424] font-normal font-poppins mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full p-3 border outline-none border-gray-300 rounded-md"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#242424] font-normal font-poppins mb-2">
                  Alternate Phone Number
                </label>
                <input
                  type="text"
                  className="w-full p-3 border outline-none border-gray-300 rounded-md"
                  placeholder="Enter alternate phone number"
                  value={alternatePhoneNumber}
                  onChange={(e) => setAlternatePhoneNumber(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-[#242424] font-normal font-poppins mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 border outline-none border-gray-300 rounded-md"
                  placeholder="Enter email address"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block font-normal font-poppins text-[#242424] mb-2">
                  Select Method
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center ">
                    <input
                      type="radio"
                      className="form-radio text-[#B88E2F]"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <span className="ml-2 font-normal font-poppins tex-[#242424]">
                        Cash on Delivery
                      </span>
                    </div>
                  </label>
                  <p className="text-base font-normal font-poppins text-[#242424]">
                    Pay after receiving the product
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-[#B88E2F] transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
              >
                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#B88E2F] group-hover:h-full"></span>
                <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                  <FaArrowRight />
                </span>
                <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                  <FaArrowRight className="text-white" />
                </span>
                <span className="relative font-poppins  w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                  continue
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
