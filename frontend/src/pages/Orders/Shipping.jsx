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
          className="w-full max-w-7xl bg-white p-8 rounded-lg shadow-lg border"
        >
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Shipping
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side Inputs (Address, City, Postal Code, Country) */}
            <div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Enter address"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Enter city"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Enter postal code"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
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
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Alternate Phone Number
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Enter alternate phone number"
                  value={alternatePhoneNumber}
                  onChange={(e) => setAlternatePhoneNumber(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Enter email address"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Select Method
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-pink-500"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2 text-gray-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button
                className="bg-pink-500 text-white py-3 px-6 rounded-full text-lg w-full hover:bg-pink-600 active:bg-pink-700 transition-all"
                type="submit"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
