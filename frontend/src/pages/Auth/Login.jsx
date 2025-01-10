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
    <section className="bg-gray-50  flex justify-center items-center h-screen">
      <div className="flex justify-center items-center flex-col w-full px-4 py-8 mx-auto lg:py-0">
        <div className="w-full bg-[#F9F1E7] rounded-md  max-w-md">
          <div className="p-6 space-y-2  rounded-md">
            <h1 className="text-2xl font-normal font-poppins leading-tight text-center text-[#242424] ">
              Login
            </h1>
            <form onSubmit={submitHandler} className="space-y-2" action="#">
              <div>
                <label className="block mb-2 text-sm font-poppins font-normal text-[#242424]">
                  Your email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="w-full  border text-gray-900 sm:text-sm rounded-md p-2.5 outline-none   dark:placeholder-gray-400"
                  placeholder="name@gmail.com"
                  required=""
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-poppins font-normal text-[#242424]">
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
                    className="w-full  border text-gray-900 sm:text-sm rounded-md p-2.5 outline-none   dark:placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[#9F9F9F]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="w-full text-white outline-none font-semibold font-sans rounded-md text-base px-5 py-2.5 bg-[#B88E2F]"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-[#9F9F9F] font-normal font-poppins">
                New user?{" "}
                <Link
                  to="/register"
                  className="text-[#B88E2F] font-poppins text-sm"
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
