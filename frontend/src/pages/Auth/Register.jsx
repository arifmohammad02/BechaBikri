import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "@redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Email regex pattern for basic validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Input field validation
    if (!username) {
      toast.error("Username is required", { autoClose: 2000 });
      return;
    }
    if (!email) {
      toast.error("Email is required", { autoClose: 2000 });
      return;
    }
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address", { autoClose: 2000 });
      return;
    }
    if (!password) {
      toast.error("Password is required", { autoClose: 3000 });
      return;
    }
    if (!confirmPassword) {
      toast.error("Please confirm your password", { autoClose: 2000 });
      return;
    }

    // Password length validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters", {
        autoClose: 3000,
      });
      return;
    }

    // Password matching validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { autoClose: 2000 });
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("User successfully registered", { autoClose: 2000 });
      navigate("/login");
    } catch (err) {
      // console.log(err);
      toast.error(
        err.data.message || "Registration failed. Please try again.",
        { autoClose: 2000 }
      );
    }
  };

  return (
    <section className="bg-gray-50  h-screen flex items-center my-10 justify-center">
      <ToastContainer
        position="top-center"
        closeOnClick
        pauseOnHover
        theme="dark"
      />
      <div className="flex justify-center items-center flex-col w-full px-4 mx-auto ">
        <div className="w-full max-w-md bg-[#F9F1E7] rounded-lg ">
          <div className="p-6 space-y-2 border  rounded-md">
            <h1 className="text-xl font-medium font-poppins leading-tight tracking-tight text-[#242424] md:text-2xl text-center">
              Create an Account
            </h1>
            <form onSubmit={submitHandler} className="space-y-2" action="#">
              <div>
                <label className="block mb-2 text-sm font-poppins font-normal text-[#242424] ">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full  border text-gray-900 sm:text-sm rounded-md p-2.5 outline-none   dark:placeholder-gray-400 "
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-poppins font-normal text-[#242424]">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full  border text-gray-900 sm:text-sm rounded-md p-2.5 outline-none   dark:placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-poppins font-normal text-[#242424]">
                  Set Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full  border text-gray-900 sm:text-sm rounded-md p-2.5 outline-none   dark:placeholder-gray-400"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[#9F9F9F]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-poppins font-normal text-[#242424]">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full  border text-gray-900 sm:text-sm rounded-md p-2.5 outline-none   dark:placeholder-gray-400"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[#9F9F9F]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-poppins font-normal text-[#9F9F9F">
                    I accept the{" "}
                    <Link
                      className="font-medium text-base font-poppins text-[#B88E2F]"
                      to="/termsCondition"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white outline-none font-semibold font-sans rounded-md text-base px-5 py-2.5 bg-[#B88E2F]"
              >
                Create an Account
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-[#9F9F9F] font-normal font-poppins">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#B88E2F] font-poppins text-sm"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
