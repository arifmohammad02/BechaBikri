import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!email) {
      toast.error("Email is required.", { autoClose: 2000 });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.", { autoClose: 2000 });
    } else if (!password) {
      toast.error("Password is required.", { autoClose: 2000 });
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.", {
        autoClose: 2000,
      });
    } else {
      try {
        // Attempt login if validation passes
        const res = await login({ email, password }).unwrap();
        // console.log(res);

        // Show success message
        toast.success("Login successful!", { autoClose: 1500 });

        // Dispatch credentials if login is successful
        dispatch(setCredentials({ ...res }));

        navigate("/");
      } catch (err) {
        // Check if the error is due to incorrect password
        if (err?.data?.message === "Incorrect password") {
          toast.error("Incorrect password. Please try again.", {
            autoClose: 2000,
          });
        } else if (err?.data?.message) {
          toast.error(err.data.message, { autoClose: 2000 });
        } else if (err.error) {
          toast.error(err.error, { autoClose: 2000 });
        } else {
          toast.error("Login failed. Please try again.", { autoClose: 2000 });
        }
      }
    }
  };

  return (
    <section className="bg-[#F3F6F9] flex justify-center items-center h-screen">
      <div className="flex justify-center items-center flex-col w-full px-4 py-8 mx-auto">
        <div className="w-full bg-[#FFFFFF] rounded-md md:w-[500px] border border-gray-300 shadow-md">
          <div className="p-6 space-y-2 rounded-md">
            <h1 className="text-[24px] font-figtree font-bold text-center text-[#020101]">
              Login
            </h1>
            <p className="text-[14px] font-figtree font-normal text-center text-[#242424] mt-5 pb-3">
              Login to your account to continue
            </p>
            <form onSubmit={submitHandler} className="space-y-2" action="#">
              <div className="mb-6">
                <label className="block mb-2 text-[12px] font-figtree font-bold text-[#212B36] uppercase">
                  email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="border border-gray-300 rounded-md py-3 w-full px-3 text-[16px] font-figtree font-normal text-[#212B36] bg-white"
                  placeholder="name@gmail.com"
                  required=""
                />
              </div>
              <div>
                <label className="block mb-2 text-[12px] font-figtree font-bold text-[#212B36] uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border border-gray-300 rounded-md py-3 w-full px-3 text-[16px] font-figtree font-normal text-[#212B36] bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[#000000]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between pt-5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    className="w-4 h-4 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <label className="block text-[12px] font-figtree font-normal text-[#212B36] capitalize">
                    Remember me
                  </label>
                </div>
                <p>
                  <Link
                    to="/#"
                    className="text-[#007EFC] font-figtree font-semibold text-[14px]"
                  >
                    Forgot Password?
                  </Link>
                </p>
              </div>
              <div className="py-6">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full text-white font-figtree font-bold text-[16px] outline-none rounded-[4px] px-5 py-2.5 bg-[#007EFC] hover:bg-blue-600 transition-all duration-300"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <p className="text-[#212B36] font-figtree font-semibold text-[14px]">
                Don't you have an account?
                <Link
                  to="/register"
                  className="text-[#007EFC] font-figtree font-semibold text-[14px] pl-1"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
