import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@redux/api/usersApiSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!username.trim()) return toast.error("Username is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!emailPattern.test(email)) return toast.error("Enter a valid email");
    if (password.length < 8) return toast.error("Password must be 8+ characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    try {
      await register({ username, email, password }).unwrap();
      toast.success("Registration successful! Check email for OTP.");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Registration failed");
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] px-3 pt-24  font-figtree">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50 blur-[120px]" />
      </div>

      <div className="w-full max-w-[480px] animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Create Account
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Join our community and start shopping
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">
              {/* Name Input */}
              <div className="group">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#007EFC] transition-colors">
                    <FaUser size={14} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Username"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:bg-white focus:border-[#007EFC] focus:ring-[3px] focus:ring-blue-100 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Input */}
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
                    placeholder="arixgear@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:bg-white focus:border-[#007EFC] focus:ring-[3px] focus:ring-blue-100 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Password
                </label>
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
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="group">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#007EFC] transition-colors">
                    <FaLock size={14} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm focus:bg-white focus:border-[#007EFC] focus:ring-[3px] focus:ring-blue-100 outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#007EFC] text-white font-bold py-4 rounded-xl shadow-[0_4px_15px_rgba(0,126,252,0.25)] hover:bg-[#006ee0] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#007EFC] font-bold hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Helper Footer */}
        <p className="text-center text-gray-400 text-xs mt-6 px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  );
};

export default Register;