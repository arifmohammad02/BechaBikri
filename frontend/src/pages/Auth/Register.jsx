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
    <section className="bg-[#F3F6F9] h-[100vh] flex items-center justify-center w-full">
      <ToastContainer
        position="top-center"
        closeOnClick
        pauseOnHover
        theme="dark"
      />
      <div className="flex justify-center items-center flex-col w-full px-4 mx-auto ">
        <div className="w-full bg-[#FFFFFF] rounded-md md:w-[500px] border border-gray-300 shadow-md">
          <div className="p-6 space-y-2 border  rounded-md">
            <h1 className="text-[24px] font-figtree font-bold text-center text-[#020101]">
              Sign up
            </h1>
            <p className="text-[14px] font-figtree font-normal text-center text-[#242424] mt-5 pb-3">
              Create an Account
            </p>
            <form onSubmit={submitHandler} className="space-y-2" action="#">
              <div className="pb-4">
                <label className="block mb-2 text-[12px] font-figtree font-bold text-[#212B36] uppercase">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="border border-gray-300 rounded-md py-3 w-full px-3 text-[16px] font-figtree font-normal text-[#212B36] bg-white"
                  required
                />
              </div>
              <div className="pb-4">
                <label className="block mb-2 text-[12px] font-figtree font-bold text-[#212B36] uppercase">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="border border-gray-300 rounded-md py-3 w-full px-3 text-[16px] font-figtree font-normal text-[#212B36] bg-white"
                  required
                />
              </div>
              <div className="pb-4">
                <label className="block mb-2 text-[12px] font-figtree font-bold text-[#212B36] uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-md py-3 w-full px-3 text-[16px] font-figtree font-normal text-[#212B36] bg-white"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[#000000]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
              <div className="pb-4">
                <label className="block mb-2 text-[12px] font-figtree font-bold text-[#212B36] uppercase">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-gray-300 rounded-md py-3 w-full px-3 text-[16px] font-figtree font-normal text-[#212B36] bg-white"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[#000000]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white font-figtree font-bold text-[16px] outline-none rounded-[4px] px-5 py-2.5 bg-[#007EFC] hover:bg-blue-600 transition-all duration-300"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
            <div className="pt-6 flex items-center justify-center gap-2">
              <h6 className="text-[14px] font-figtree font-semibold text-[#212B36]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#007EFC] text-[14px] font-figtree font-semibold"
                >
                  Login
                </Link>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
