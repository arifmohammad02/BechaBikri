import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    // ভ্যালিডেশন
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Enter a valid email");
    if (!password) return toast.error("Password is required");

    try {
      // unwrap() সরাসরি এরর বা রেসপন্স হ্যান্ডেল করতে সাহায্য করে
      const res = await login({ email, password }).unwrap();
      
      dispatch(setCredentials({ ...res }));
      toast.success("Welcome back! Login successful.");
      navigate("/");
    } catch (err) {
      // টোস্ট মেসেজ ফিক্স
      const errorMessage = err?.data?.message || err?.error || "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 font-figtree">
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] rounded-full bg-blue-50 blur-[100px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-50 blur-[100px]" />
      </div>

      <div className="w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Please enter your details to sign in
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">
              {/* Email Field */}
              <div className="group">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#007EFC] transition-colors">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:bg-white focus:border-[#007EFC] focus:ring-[3px] focus:ring-blue-100 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-[11px] font-bold text-[#007EFC] hover:underline uppercase tracking-tighter">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#007EFC] transition-colors">
                    <FaLock size={14} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:bg-white focus:border-[#007EFC] focus:ring-[3px] focus:ring-blue-100 outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-[#007EFC] border-gray-300 rounded focus:ring-[#007EFC] cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs font-semibold text-gray-500 cursor-pointer select-none">
                  Keep me signed in
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#007EFC] text-white font-bold py-4 rounded-xl shadow-[0_6px_20px_rgba(0,126,252,0.2)] hover:bg-[#006ee0] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm font-medium">
                Don&apos;t have an account?
                <Link to="/register" className="text-[#007EFC] font-bold hover:underline underline-offset-4">
                  Register Now
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